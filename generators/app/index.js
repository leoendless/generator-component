var path = require('path');
var fs = require('fs');
var capitalize = require('lodash.capitalize');
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('componentName', {type: String, require: true});
    this.option('githubUrl', {type: String, desc: 'URL of your github repo'});
    this.option('description', {type: String, desc: 'One line description about your component'});
    this.componentName = this.options.componentName;
    this.prettyComponentName = this.componentName.split('-').map(function(word) {
      return capitalize(word);
    }).join(' ');
    this.author = 'leoliu@yunify.com';
    this.githubUrl = this.options.githubUrl || ('https://github.com/leoendless/' + this.componentName);
    this.description = this.options.description || (this.prettyComponentName + ' Component');
  }

  initializing() {
    this.destinationRoot(path.resolve(process.cwd(), this.componentName));
  }

  writing() {
    [
      '_eslintrc',
      '_babelrc',
      '_gitignore',
      '_npmignore',
      'package.json',
      'README.md',
    ].forEach(function(filename) {
      const fn = filename.replace('_', '.');
      this.fs.copyTpl(this.templatePath(filename), this.destinationPath(fn), this);
    }.bind(this));

    [
      'src',
      '.scripts',
      '.storybook'
    ].forEach(function(path) {
      this.fs.copy(this.templatePath(path), this.destinationPath(path));
    }.bind(this));
  }

  install() {
    this.log('install npm dependencies.');
    this.spawnCommandSync('npm', ['i']);
    this.spawnCommandSync('npm', ['run', 'storybook']);
  }

  end() {
    this.log('');
    this.log('Awesome! Your component'+ this.prettyComponentName + 'is ready!');
    this.log('');
  }
}