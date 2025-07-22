import { importCsv } from '../util/csv.js';
import { filePrompt } from '../util/file.js';

const termColumn = 0;
const matchColumn = 1;

export const importer = new class ImporterService {
  async importFromFile() {
    return new Promise(resolve => {
      filePrompt({
        read: files => {
          const data = [];
          const fileCount = files.length;
          let fileLoadedCount = 0;
          for (let i = 0; i < fileCount; ++i) {
            const file = files[i];
            let { name } = file;
            const reader = new FileReader();
            reader.addEventListener('load', ({ target }) => {
              console.log('Importing file: ', name);
              const csv = importCsv({
                text: target.result,
              });
              const terms = [];
              for (const columns of csv) {
                if (columns.length < 2) {
                  continue;
                }
                terms.push({
                  term: columns[termColumn],
                  match: columns[matchColumn],
                  weight: 1,
                });
              }
              name = name.replace(/\.csv$/, '');
              data.push({ name, terms });
              if (++fileLoadedCount >= fileCount) {
                resolve(data);
              }
            });
            reader.readAsText(file, 'utf8');
          }
        },
      });
    });
  }
};
