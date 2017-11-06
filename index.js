// @ts-nocheck

const SteamerPlugin = require('steamer-plugin');
const inquirer = require('inquirer');
const klawSync = require('klaw-sync');
const path = require('path');

class YdjAddPlugin extends SteamerPlugin {
    constructor(args) {
        super(args);
        this.argv = args;
        this.pluginName = 'steamer-plugin-ydj-add';
        this.description = 'steamer plugin example';
    }

    init() {
        // this.help()
        this.auto();
    }

    help() {
        this.printUsage('添加初始代码文件', 'ydj-add');
    }

    auto() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'kit',
                    message: '正在使用哪个脚手架？',
                    choices: ['ydj-vue-ts'],
                    pageSize: 50
                },
                {
                    type: 'list',
                    name: 'type',
                    message: '要添加什么类型的代码文件？',
                    choices: ['component', 'view', 'page'],
                    pageSize: 10
                },
                {
                    type: 'input',
                    name: 'name',
                    message: '请输入代码文件名称：'
                }
            ])
            .then(answer => {
                const kit = answer.kit;
                const name = answer.name;
                const fileType = answer.type;

                if (kit === 'ydj-vue-ts') {
                    if (fileType === 'component') {
                        this.info(`您选择添加了 [${kit}] 项目的 [${fileType}] 类型代码： ${name}`);
                        this.addVueTsComponent(name);
                    }
                    if (fileType === 'view') {
                        this.info(`您选择添加了 [${kit}] 项目的 [${fileType}] 类型代码： ${name}`);
                        this.addVueTsView(name);
                    }
                    if (fileType === 'page') {
                        this.info(`您选择添加了 [${kit}] 项目的 [${fileType}] 类型代码： ${name}`);
                        this.addVueTsPage(name);
                    }
                }
            });
    }

    copyTemplateFile(srcPath, targetPath) {
        // this.fs.copyFileSync()
    }

    walkAndReplace(folder, extensions = [], replaceObj = {}) {
        let files = klawSync(folder, { nodir: true });

        if (extensions.length) {
            files = files.filter(item => {
                const ext = path.extname(item.path);
                return extensions.includes(ext);
            });
        }

        files.forEach(file => {
            let content = this.fs.readFileSync(file.path, 'utf-8');

            Object.keys(replaceObj).forEach(key => {
                content = content.replace(
                    new RegExp(`<% ${key} %>`, 'g'),
                    match => replaceObj[key]
                );
            });

            this.fs.writeFileSync(file.path, content, 'utf-8');
        });
    }

    addVueTsComponent(name) {
        const files = this.fs.readdirSync(path.join(__dirname, './vue-ts-component/'));
        this.fs.mkdirSync(path.join(process.cwd(), 'src/components', name));
        files.forEach(file => {
            const outPutFile = file.replace(/^component\./, `${name}.`);
            this.fs.copyFileSync(
                path.join(__dirname, `./vue-ts-component/${file}`),
                path.join(process.cwd(), 'src/components', name, outPutFile)
            );
        });
        this.walkAndReplace(path.join(process.cwd(), 'src/components', name), ['.scss', '.less', '.styl', '.sass', '.ts', '.vue'], {
            name,
            Name: name[0].toLocaleUpperCase() + name.substr(1)
        });
    }

    addVueTsView(name) {
        const files = this.fs.readdirSync(path.join(__dirname, './vue-ts-component/'));
        this.fs.mkdirSync(path.join(process.cwd(), 'src/views', name));
        files.forEach(file => {
            const outPutFile = file.replace(/^component\./, `${name}.`);
            this.fs.copyFileSync(
                path.join(__dirname, `./vue-ts-component/${file}`),
                path.join(process.cwd(), 'src/views', name, outPutFile)
            );
        });
        this.walkAndReplace(path.join(process.cwd(), 'src/views', name), ['.scss', '.less', '.styl', '.sass', '.ts', '.vue'], {
            name,
            Name: name[0].toLocaleUpperCase() + name.substr(1)
        });
    }

    addVueTsPage(name) {
        const files = this.fs.readdirSync(path.join(__dirname, './vue-ts-page/'));
        this.fs.mkdirSync(path.join(process.cwd(), 'src/page', name));
        const Name = name[0].toLocaleUpperCase() + name.substr(1);
        files.forEach(file => {
            const outPutFile = file.replace(/^page\./, `${name}.`).replace(/^Page\./, `${Name}.`);
            this.fs.copyFileSync(
                path.join(__dirname, `./vue-ts-page/${file}`),
                path.join(process.cwd(), 'src/page', name, outPutFile)
            );
        });
        this.walkAndReplace(path.join(process.cwd(), 'src/page', name), ['.ts', '.html', '.vue'], {
            name,
            Name
        });
    }
}

module.exports = YdjAddPlugin;
