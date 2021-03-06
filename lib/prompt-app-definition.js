const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');

module.exports = async function promptAppDefinition() {
  console.log(
    chalk.dim(`
NOTE: This will create an app definition in your Contentful organization.
      - Read more about app definitions: ${chalk.underline('https://ctfl.io/app-definitions')}
      - Read more about app locations: ${chalk.underline('https://ctfl.io/app-locations')}
  `)
  );

  const appDefinitionSettings = await inquirer.prompt([
    {
      name: 'name',
      message: `App name (${path.basename(process.cwd())}):`
    },
    {
      name: 'locations',
      message: `Select where your app can be rendered:`,
      type: 'checkbox',
      choices: [
        { name: 'Entry field (entry-field) ', value: 'entry-field' },
        { name: 'Entry editor (entry-editor)', value: 'entry-editor' },
        { name: 'Entry sidebar (entry-sidebar) ', value: 'entry-sidebar' },
        { name: 'Page (page) ', value: 'page' },
      ],
    },
    {
      name: 'fields',
      message: 'Select the field types the app can be rendered:',
      type: 'checkbox',
      choices: [
        { name: 'Short text', value: { type: 'Symbol' } },
        { name: 'Short text, list', value: { type: 'Array', items: { type: 'Symbol' } } },
        { name: 'Long text', value: { type: 'Text' } },
        { name: 'Rich text', value: { type: 'RichText' } },
        { name: 'Number, integer', value: { type: 'Integer' } },
        { name: 'Number, decimal', value: { type: 'Number' } },
        { name: 'Date and time', value: { type: 'Date' } },
        { name: 'Location', value: { type: 'Location' } },
        { name: 'Boolean', value: { type: 'Boolean' } },
        { name: 'JSON object', value: { type: 'Object' } },
        { name: 'Entry reference', value: { type: 'Link', linkType: 'Entry' } },
        {
          name: 'Entry reference, list',
          value: {
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
            },
          },
        },
        { name: 'Media reference', value: { type: 'Link', linkType: 'Asset' } },
        {
          name: 'Media reference, list',
          value: { type: 'Array', items: { type: 'Link', linkType: 'Asset' } },
        },
      ],
      when(answers) {
        return answers.locations.includes('entry-field');
      },
      validate(answers) {
        if (answers.length < 1) {
          return 'You must choose at least one field type.';
        }
        return true;
      },
    },
  ]);

  // Add app-config & dialog automatically
  appDefinitionSettings.locations = ['app-config', 'dialog', ...appDefinitionSettings.locations];

  return appDefinitionSettings;
};
