
import fs from 'fs';
import path from 'path';
import Busboy from 'busboy';
import os from "os";

type Dict = {
    [key: string]: any
}

export class UpdateFile {
    
    constructor(){  }

    /**
     * 
     * app.post('/upload', formMiddlware, (req: any, res: any) => {
    console.log(req.body);
    console.log(req.files);
    res.sendStatus(200);
    });
     */
    formMiddlware(req: any , res: any, next: any) {
        // See https://cloud.google.com/functions/docs/writing/http#multipart_data
       
        const busboy = Busboy({
          headers: req.headers,
          limits: {
            // Cloud functions impose this restriction anyway
            fileSize: 10 * 1024 * 1024,
          }
        });

        const fields: Dict = {};
        const files: any[] = [];
        const fileWrites: any[] = [];

        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        // --> C:\Users\Skyrider\AppData\Local\Temp
        const tempDir = os.tmpdir();

        busboy.on('field', (key: string, value: any) => {
          // You could do additional deserialization logic here, values will just be
          // strings
          fields[key] = value;
        });

        busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
          const filepath = path.join(tempDir, filename);
          console.log(`Handling file upload field ${fieldname}: ${filename} (${filepath})`);
          const writeStream = fs.createWriteStream(filepath);
          file.pipe(writeStream);
                 fileWrites.push(new Promise((resolve, reject) => {
            file.on('end', () => writeStream.end());
            writeStream.on('finish', () => {
              fs.readFile(filepath, (err, buffer) => {
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
                  fs.unlinkSync(filepath);
                } catch (error) {
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
    uniqueAlphaNumericId(limitCharacter: number){
        const heyStack = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length));
        const length: number = limitCharacter;
        return  Array.from({length}, () => heyStack[randomInt()]).join('');
        // return "fred";
    }
    
    
    getFilePath(folder:string, fileId: any, fileName:any){

        const soloNombre = fileName.split('.');
        const extensionArchivo = soloNombre[ soloNombre.length -1 ];

        // return `${ folder.split(" ").join("") }/${ fileId }-${ fileName.split(" ").join("") }`;
        return `${ folder.split(" ").join("") }/${ fileId }.${ extensionArchivo }`;
    }

}
