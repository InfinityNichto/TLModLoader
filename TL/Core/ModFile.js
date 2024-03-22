import { BinaryIO } from "../IO/BinaryIO.js";
import { EntryReadStream } from "./EntryReadStream.js";
import { System } from "../ModImports.js";

const File = System.IO.File;
const Directory = System.IO.Directory;
const Path = System.IO.Path;
const BinaryReader = System.IO.BinaryReader;
const BinaryWriter = System.IO.BinaryWriter;
const MemoryStream = System.IO.MemoryStream;
const CompressionMode = System.IO.Compression.CompressionMode;
const DeflateStream = System.IO.Compression.DeflateStream;
const Encoding = System.Text.Encoding;

const Create = File["FileStream Create(string path)"];
const CreateDirectory = Directory["DirectoryInfo CreateDirectory(string path)"];
const GetDirectoryName = Path["string GetDirectoryName(string path)"];

export class ModFile {
    constructor(path, name = null) {
        this.path = path;
        this.Name = name;
    }

    get Count() { return this.fileTable.length; }
    get IsOpen() { return this.fileStream != null; }

    MIN_COMPRESS_SIZE = 1024;
    MAX_CACHE_SIZE = 131072;
    COMPRESSION_TRADEOFF = 0.9;

    files = {};
    fileStream;
    fileTable = [];
    openCounter;

    sharedEntryReadStream;
    independentEntryReadStreams = [];

    Hash;
    Signature = new Uint8Array(256);

    *[Symbol.iterator]() {
        for (const entry of this.fileTable) {
            yield entry;
        }
    }

    HasFile(filePath) {
        return this.files.hasOwnProperty(filePath);
    }

    GetStream(entry, newFileStream = false) {
        if (typeof entry === 'string') {
            const fileEntry = this.files[entry];
            if (!fileEntry) {
                throw new Error("File entry not found for path: " + entry);
            }
            entry = fileEntry;
        }

        let stream;

        if (entry.cachedBytes != null){
            stream = BinaryIO.ToMemoryStream(entry.cachedBytes);
        } else {
            if (this.fileStream != null) {
                throw new Error("File not open: " + this.path);
            }

            if (newFileStream) {
                const entryReadStream = new EntryReadStream(this.constructor, entry, File.OpenRead(this.path), false);
                this.independentEntryReadStreams.push(entryReadStream);
                stream = entryReadStream;
            } else {
                if (this.sharedEntryReadStream != null) {
                    throw new Error("Previous entry read stream not closed: " + this.sharedEntryReadStream.Name);
                }
                
                stream = this.sharedEntryReadStream = new EntryReadStream(this.constructor, entry, fileStream, true);
            }
        }

        if (entry.IsCompressed) {
            stream = DeflateStream.new()["void .ctor(Stream stream, CompressionMode mode)"](stream, CompressionMode.Compress);
        }

        return stream;
    }

    OnStreamClosed(stream) {
        if (stream == this.sharedEntryReadStream) {
            this.sharedEntryReadStream = null;
            return;
        }

        const toRemove = this.independentEntryReadStreams.indexOf(stream);
        if (toRemove != -1) {
            this.independentEntryReadStreams.splice(toRemove, 1);
        } else {
            throw new Error("Closed EntryReadStream not associated with this file. " + stream.Name + " @ " + this.path);
        }
    }

    GetBytes(entry) {
        if (entry.cachedBytes != null && entry.IsCompressed) {
            return entry.cachedBytes;
        }

        return this.GetStream(entry).ReadBytes(entry.Length);
    }

    GetBytesByPath(filePath) {
        if (this.files.hasOwnProperty(filePath)) {
            const entry = this.files[filePath];
            return this.GetBytes(entry);
        }

        return null;
    }

    GetFileNames() {
        return Object.keys(this.files);
    }

    ShouldCompress(fileName) {
        if (!fileName.endsWith(".png") && !fileName.endsWith(".mp3")) {
            return !fileName.endsWith(".ogg");
        }

        return false;
    }

    AddFile(fileName, data) {
        const size = data.length;

        if (size > 1024 && this.ShouldCompress(fileName)) {
            const memoryStream = MemoryStream.new()["void .ctor(byte buffer)"](data.length);
            const deflatedStream = DeflateStream.new()["void .ctor(Stream stream, CompressionMode mode)"](ms, CompressionMode.Decompress);
            
            deflatedStream.Write(data, 0, data.length); 

            const compressed = memoryStream.ToArray();
            if (compressed.Length < size * 0.9) {
                data = compressed;
            }
        }

        this.files[fileName] = new FileEntry(fileName, -1, size, data.length, data);
        this.fileTable = null;
    }

    RemoveFile(fileName) {
        delete this.files[fileName];
        this.fileTable = null;
    }

    Save() {
        if (this.fileStream != null) {
            throw new Error("File already open: " + this.path);
        }

        CreateDirectory(GetDirectoryName(this.path));
        this.fileStream = Create(this.path);

        const writer = BinaryWriter.new()["void .ctor(Stream output)"](this.fileStream);
        writer.Write(Encoding.ASCII.GetBytes("TL"));

        const hashPos = this.fileStream.Position;
        writer.Write(new Uint8Array(280));

        const dataPos = this.fileStream.Position;
        writer.Write(this.Name);
        this.fileTable = Object.values(this.files);
        writer.Write(this.fileTable.length);

        const entries = this.fileTable;
        for (const entry of entries) {
            if (entry.CompressedLength != entry.cachedBytes.length) {
                throw new Error(`CompressedLength (${entry.CompressedLength}) != cachedBytes.Length (${entry.cachedBytes.length}): ${entry.Name}`);
            }

            writer.Write(entry.Name);
            writer.Write(entry.Length);
            writer.Write(entry.CompressedLength);
        }

        let offset = this.fileStream.Position;
        for (const entry of this.fileTable) {
            writer.Write(entry.cachedBytes);
            entry.Offset = offset;
            offset += entry.CompressedLength;
        }

        this.fileStream.Position = dataPos;
        this.Hash = SHA1.Create().ComputeHash(this.fileStream);
        this.fileStream.Position = hashPos;
        writer.Write(this.Hash);
        this.fileStream.Seek(256, SeekOrigin.Current);
        writer.Write(this.fileStream.Length - dataPos);

        this.fileStream = null;
    }

    Open() {
        if (this.openCounter++ > 0) {
            return new DisposeWrapper(this.Close);
        }
    
        if (this.fileStream !== null) {
            throw new Error("File already opened? " + this.path);
        }
    
        try {
            if (this.Name === null) {
                this.Read();
            } else {
                this.Reopen();
            }
        } catch(error) {
            this.Close();
            throw error;
        }
    }

    Close() {
        if (this.openCounter == 0 || --this.openCounter != 0) {
            return;
        }

        if (this.sharedEntryReadStream != null) {
            throw new Error("Previous entry read stream not closed: " + this.sharedEntryReadStream.Name);
        }

        if (this.independentEntryReadStreams.Count != 0) {
            throw new Error("Shared entry read streams not closed: " + independentEntryReadStreams.map(e => e.name).join(", "));
        }

        this.fileStream?.Close();
        this.fileStream = null;
    }

    Read() {
        this.fileStream = File.OpenRead(this.path);
        reader = BinaryReader.new()["void .ctor(Stream input)"](this.fileStream);

        if (Encoding.ASCII.GetString(reader.ReadBytes(4)) != "TL") {
            throw new Error("Magic Header is not \"TL\"");
        }

        this.Hash = reader.ReadBytes(20);
        this.Signature = reader.ReadBytes(256);
        reader.ReadInt32();

        const pos = this.fileStream.Position;
        if (!SHA1.Create().ComputeHash(this.fileStream).SequenceEqual(this.Hash)) {
            throw new Error("Hash mismatch error");
        }

        this.fileStream.Position = pos;
        this.Name = reader.ReadString();

        let offset = 0;
        this.fileTable = new Array(reader.ReadInt32()).fill().map(() => new FileEntry());
        for (let i = 0; i < this.fileTable.length; i++) {
            const entry = new FileEntry(reader.ReadString(), offset, reader.ReadInt32(), reader.ReadInt32());
            this.fileTable[i] = entry;
            this.files[entry.Name] = entry;
            offset += entry.CompressedLength;
        }

        const fileStartPos = this.fileStream.Position;
        for (const entry of this.fileTable) {
            entry.Offset += fileStartPos;
        }
    }
 
    Reopen() {
        this.fileStream = File.OpenRead(this.path);
        const reader = BinaryReader.new()["void .ctor(Stream input)"](this.fileStream);
       
        if (Encoding.ASCII.GetString(reader.ReadBytes(4)) != "TL") {
            throw new Error("Magic Header is not \"TL\"");
        }

        reader.ReadString();
        if (!reader.ReadBytes(20).SequenceEqual(this.Hash)) {
            throw new Error("File has been modified, hash. " + this.path);
        }
    }

    CacheFiles(toSkip = null) {
        this.fileStream.Seek(this.fileTable[0].Offset, SeekOrigin.Begin);

        for (const entry of this.fileTable) {
            if (entry.CompressedLength > 131072 || (toSkip != null && toSkip.includes(entry.Name))) {
                this.fileStream.Seek(entry.CompressedLength, SeekOrigin.Current);
            } else {
                entry.cachedBytes = this.fileStream.ReadBytes(entry.CompressedLength);
            }
        }
    }
 
    RemoveFromCache(fileNames) {
        for (const fileName of fileNames) {
            this.files[fileName].cachedBytes = null;
        }
    }
 
    ResetCache() {
        for (const entry of this.fileTable) {
            entry.cachedBytes = null;
        }
    }
}

class FileEntry {
    constructor(name = null, offset = 0, length = 0, compressedLength = 0, cachedBytes = null) {
        this.Name = name;
        this.Offset = offset;
        this.Length = length;
        this.CompressedLength = compressedLength;
        this.cachedBytes = cachedBytes;
    }

    get IsCompressed() { return this.Length != this.CompressedLength; }
}

class DisposeWrapper {
    constructor(dispose) {
        this.dispose = dispose;
    }

    Dispose() {
        this.dispose();
    }
}