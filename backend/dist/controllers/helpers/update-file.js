"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const busboy_1 = __importDefault(require("busboy"));
const os_1 = __importDefault(require("os"));
class UpdateFile {
    constructor() { }
    /**
     *
     * app.post('/upload', formMiddlware, (req: any, res: any) => {
    console.log(req.body);
    console.log(req.files);
    res.sendStatus(200);
    });
     */
    formMiddlware(req, res, next) {
        // See https://cloud.google.com/functions/docs/writing/http#multipart_data
        const busboy = new busboy_1.default({
            headers: req.headers,
            limits: {
                // Cloud functions impose this restriction anyway
                fileSize: 10 * 1024 * 1024,
            }
        });
        const fields = {};
        const files = [];
        const fileWrites = [];
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        // --> C:\Users\Skyrider\AppData\Local\Temp
        const tempDir = os_1.default.tmpdir();
        busboy.on('field', (key, value) => {
            // You could do additional deserialization logic here, values will just be
            // strings
            fields[key] = value;
        });
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path_1.default.join(tempDir, filename);
            console.log(`Handling file upload field ${fieldname}: ${filename} (${filepath})`);
            const writeStream = fs_1.default.createWriteStream(filepath);
            file.pipe(writeStream);
            fileWrites.push(new Promise((resolve, reject) => {
                file.on('end', () => writeStream.end());
                writeStream.on('finish', () => {
                    fs_1.default.readFile(filepath, (err, buffer) => {
                        const size = Buffer.byteLength(buffer);
                        console.log(`${filename} is ${size} bytes`);
                        if (err) {
                            return reject(err);
                        }
                        files.push({
                            fieldname,
                            originalname: filename,
                            encoding,
                            mimetype,
                            buffer,
                            size,
                        });
                        try {
                            fs_1.default.unlinkSync(filepath);
                        }
                        catch (error) {
                            return reject(error);
                        }
                        resolve(files);
                    });
                });
                writeStream.on('error', reject);
            }));
        });
        busboy.on('finish', () => {
            Promise.all(fileWrites)
                .then(() => {
                req.body = fields;
                req.files = files;
                next();
            })
                .catch(next);
        });
        busboy.end(req.rawBody);
        console.log("-->", files);
    }
    /**
     * @param limitCharacter ( limit character or max character random )
     * @returns caracters random e.g.: fk0peg0379exl14gxfbk6afo     */
    uniqueAlphaNumericId(limitCharacter) {
        const heyStack = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length));
        const length = limitCharacter;
        return Array.from({ length }, () => heyStack[randomInt()]).join('');
        // return "fred";
    }
    getFilePath(folder, fileId, fileName) {
        const soloNombre = fileName.split('.');
        const extensionArchivo = soloNombre[soloNombre.length - 1];
        // return `${ folder.split(" ").join("") }/${ fileId }-${ fileName.split(" ").join("") }`;
        return `${folder.split(" ").join("")}/${fileId}.${extensionArchivo}`;
    }
}
exports.UpdateFile = UpdateFile;
