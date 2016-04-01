import Ember from 'ember';
import InputMask from 'inputmask-core';

const { on, run } = Ember;

export default Ember.TextField.extend({
  setInputMask: on('init', function() {
    const pattern = this.get('pattern');

    this.inputMask = new InputMask({ pattern });
  }),

  focusIn() {
    run.next(this, '_resetCursorPosition');
  },

  input() {
    const chars = this.element.value.split('');

    this.inputMask.setValue('');
    this.inputMask.setSelection({ start: 0, end: 0 });
    chars.forEach((char) => this.inputMask.input(char));

    this._setValue();
  },

  keyPress(e) {
    this.inputMask.selection = { start: this.element.selectionStart, end: this.element.selectionEnd };

    if (this.inputMask.input(String.fromCharCode(e.which))) {
      this._setValue();
    }

    e.preventDefault();
  },

  keyDown(e) {
    if (e.keyCode === 90 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      this.inputMask.redo();
      this._setValue();
      e.preventDefault();
    } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
      this.inputMask.undo();
      this._setValue();
      e.preventDefault();
    } else if (e.keyCode === 8) {
      this.inputMask.backspace();
      this._setValue();
      e.preventDefault();
    }
  },

  _setValue() {
    const maskedValue = this.inputMask.getValue();
    this.set('value', maskedValue);

    run.schedule('afterRender', this, '_resetCursorPosition');
  },

  _resetCursorPosition() {
    this.element.setSelectionRange(this.inputMask.selection.start, this.inputMask.selection.end);
  }
});
