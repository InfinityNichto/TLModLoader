import { System } from "../ModImports.js";

Stream = System.IO.Stream;
SeekOrigin = System.IO.SeekOrigin;

export class EntryReadStream {
    constructor(file, entry, stream, leaveOpen) {
        this.base = Stream.new()["void .ctor()"]();
        this.file = file;
        this.entry = entry;
        this.stream = stream;
        this.leaveOpen = leaveOpen;
        if (this.stream.Position != Start) {
            this.stream.Position = Start;
        }
    }
 
    get Start() { return this.entry.Offset; }
    get Name() { return this.entry.Name; }
    get CanRead() { return this.stream.CanRead; }
    get CanSeek() { return this.stream.CanSeek; }
    get Length() { return this.entry.CompressedLength; }
    get Position() { return this.stream.Position - this.Start; }
    set Position(value) {
        if (value < 0 || value > this.Length) {
            throw new Error("Position " + value + " outside range (0-" + this.Length + ")");
        }

        this.stream.Position = value + this.Start;
    }

    CanWrite = false;

    Flush() { }
 
    Read(buffer, offset, count) {
        count = Math.Min(count, this.Length - this.Position);
        return this.stream.Read(buffer, offset, count);
    }
 
    Seek(offset, origin) {
        if (origin == SeekOrigin.Current) {
            const target = this.Position + offset;
            if (target < 0 || target > this.Length) {
                throw new Error("Position " + target + " outside range (0-" + this.Length + ")");
            }

            return this.stream.Seek(offset, origin) - this.Start;
        }

        this.Position = origin == SeekOrigin.Begin ? offset : this.Length - offset;
        return Position;
    }
 
    SetLength(value) { }
 
    Write(buffer, offset, count) { }
 
    Close() {
        if (this.stream != null) {
            if (!this.leaveOpen) {
                this.stream.Close();
            }

            this.stream = null;
            this.file.OnStreamClosed(this.constructor);
        }
    }
}