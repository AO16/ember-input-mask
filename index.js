/*jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');

module.exports = {
  name: 'ember-input-mask',

  treeForVendor: function(tree) {
    var inputmaskCorePath = path.dirname(require.resolve('inputmask-core'));
    var inputmaskCoreTree = concat(this.treeGenerator(inputmaskCorePath), {
      inputFiles: ['index.js'],
      outputFile: 'inputmask-core/index.js',
      header: 'define(\'inputmask-core\', [\'exports\'], function(exports) { var module = {};',
      footer: 'exports.default = InputMask;});'
    });

    return mergeTrees([tree, inputmaskCoreTree]);
  },

  included: function(app) {
    this._super.included(app);

    if (app.import) {
      this.importDependencies(app);
    }
  },

  importDependencies: function(app) {
    app.import('vendor/inputmask-core/index.js');
  }
};
