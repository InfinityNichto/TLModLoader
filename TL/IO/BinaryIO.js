import { System } from "../ModImports.js";

const BinaryWriter = System.IO.BinaryWriter;
const BinaryReader = System.IO.BinaryReader;
const MemoryStream = System.IO.MemoryStream;

export class BinaryIO {
    static SafeWrite(writer, write) {
        const stream = MemoryStream.new()["void .ctor()"]();
        write(BinaryWriter.new()["void .ctor(Stream output)"](stream));

        writer.Write7BitEncodedInt(stream.Length);
        stream.Position = 0;
        stream.CopyTo(writer.BaseStream);
    }
 
    static SafeRead(reader, read) {
        const length = reader.Read7BitEncodedInt();
        const stream = this.ToMemoryStream(this.ReadBytes(reader, length));
        read(BinaryReader.new()["void .ctor(Stream input)"](stream));

        if (stream.Position != length) {
            throw new Error("Read underflow " + stream.Position + " of " + length + " bytes");
        }
    }
 
    static ReadBytes(stream, buf) {
        if (typeof buf === "number") {
            buf = new Uint8Array(buf);
        }

        let pos = 0, r;
        while ((r = stream.Read(buf, pos, buf.length - pos)) > 0) {
            pos += r;
        }

        if (pos != buf.length) {
            throw new Error("Stream did not contain enough bytes (" + pos + ") < (" + buf.length + ")");
        }
    }
 
    static ToMemoryStream(bytes, writeable = false) {
        return MemoryStream.new()
            ["void .ctor(byte buffer, int index, int count, bool writeable, bool publiclyVisible)"]
            (bytes, 0, bytes.length, writeable, true);
    }
}