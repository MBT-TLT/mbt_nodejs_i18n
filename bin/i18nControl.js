#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { Command } from "commander";
import { osLocaleSync } from "os-locale";
import { i18nCreateCommand } from "./i18nCreateCommand.js";
import { i18nInitCommand } from "./i18nInitCommand.js";


/**
 * i18nControl - The total control of MBT_Nodejs_i18n CLI
 *
 * @const
 * @function
 * */
const i18nControl = function () {
    // read package.json as a JSON
    const baseConfig = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString());

    // new a Command and set the project name, description and version
    const totalControl = new Command(baseConfig.name)
        .description(baseConfig.description)
        .version(baseConfig.version);

    // create i18n folder command
    totalControl
        .command('create')
        .description('Create the i18n folder')
        .argument('[folderPath]', 'i18n folder path', path.resolve('./'))
        .argument('[targetLanguage]', 'target language that needs to be translated', 'en-US')
        .argument('[ownLanguage]', 'own language', osLocaleSync() || 'zh-CN')
        .action(i18nCreateCommand);

    // initialize i18n project file command
    totalControl
        .command("init")
        .description("init project")
        .argument('<projectName>', 'project Name')
        .action(i18nInitCommand);

    // parse the process.argv and running command
    totalControl.parse(process.argv);
}
i18nControl();
