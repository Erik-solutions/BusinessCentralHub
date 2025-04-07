const fs = require('fs');

const filePath = 'server/storage-db.ts';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Replace all instances of "return result.rowCount > 0;" with null check
const fixedContent = fileContent.replace(/return result.rowCount > 0;/g, 
                                          'return result.rowCount !== null && result.rowCount > 0;');

fs.writeFileSync(filePath, fixedContent);
console.log('Fixed all rowCount null checks in storage-db.ts');
