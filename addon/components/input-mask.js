import Ember from 'ember';
import InputMask from 'inputmask-core';

const { on, run } = Ember;

export default Ember.TextField.extend({
  setInputMask: on('init', function() {
    const pattern = this.get('pattern');

    this.set('inputMask', new InputMask({ pattern }));
  }),

  focusIn() {
    run.next(this, '_resetCursorPosition');
  },

  input() {
    const [...chars] = this.get('element.value');

    this.get('inputMask').setValue('');
    this.get('inputMask').setSelection({ start: 0, end: 0 });
    chars.forEach((char) => this.get('inputMask').input(char));

    this._setValue();
  },

  keyPress(e) {
    this.inputMask.selection = { start: this.get('element.selectionStart'), end: this.get('element.selectionEnd') };

    if (this.get('inputMask').input(String.fromCharCode(e.which))) {
      this._setValue();
    }

    e.preventDefault();
  },

  keyDown(e) {
    const setAndPrevent = () => {
      this._setValue();
      e.preventDefault();
    };

    if (e.keyCode === 90 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      this.inputMask.redo();
      setAndPrevent();
    } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
      this.inputMask.undo();
      setAndPrevent();
    } else if (e.keyCode === 8) {
      this.inputMask.backspace();
      setAndPrevent();
    }
  },

  _setValue() {
    const maskedValue = this.get('inputMask').getValue();
    this.set('value', maskedValue);

    run.schedule('afterRender', this, '_resetCursorPosition');
  },

  _resetCursorPosition() {
    this.get('element').setSelectionRange(this.get('inputMask.selection.start'), this.get('inputMask.selection.end'));
  }
});
