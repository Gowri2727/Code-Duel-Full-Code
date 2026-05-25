
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { v4: uuid } = require('uuid');

const runCodeLocally = async (code, input, language) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // ✅ Clean up prompt-based input() in Python
    if (language === 'python') {
      code = code.replace(/input\s*\([^\)]*\)/g, 'input()');
    }

    const filePath = path.join(tempDir, `${id}.${language === 'java' ? 'java' : 'py'}`);
    const inputPath = path.join(tempDir, `${id}.in`);

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputPath, input);

    const command = language === 'java'
      ? ['javac', filePath]
      : ['python3', filePath];

    const execCommand = language === 'java'
      ? ['java', '-cp', tempDir, path.basename(filePath, '.java')]
      : ['python3', filePath];

    if (language === 'java') {
      const compile = spawn(command[0], command.slice(1));
      compile.on('close', (code) => {
        if (code !== 0) return resolve({ success: false, error: 'Compilation failed' });
        run(execCommand);
      });
    } else {
      run(execCommand);
    }

    function run(execCommand) {
      const run = spawn(execCommand[0], execCommand.slice(1), {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const inputStream = fs.createReadStream(inputPath);
      inputStream.pipe(run.stdin);

      let output = '', error = '';
      run.stdout.on('data', (data) => (output += data));
      run.stderr.on('data', (data) => (error += data));

      run.on('close', () => {
        cleanup();
        if (error) return resolve({ success: false, error });
        resolve({ success: true, output: output.trim() });
      });
    }

    function cleanup() {
      try {
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputPath);
        if (language === 'java') {
          const classFile = path.join(tempDir, `${path.basename(filePath, '.java')}.class`);
          if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
        }
      } catch (e) {
        console.warn('Cleanup failed:', e.message);
      }
    }
  });
};

module.exports = runCodeLocally;
