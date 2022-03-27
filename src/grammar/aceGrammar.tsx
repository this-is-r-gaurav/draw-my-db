import 'ace-builds/src-noconflict/mode-text'
import * as ace from 'ace-builds/src-noconflict/ace';
export class CustomHighlightRules extends ace.acequire(
  'ace/mode/text_highlight_rules'
).TextHighlightRules {
  constructor() {
    super()

    this.$rules = {
      start: [
        {
          token: 'empty_line',
          regex: /^\s*$/,
          next: 'start',
        },
        {
          token: function () {
            return ['support.class', 'b', 'tablename', 'b', 'opendef', 'b']
          },
          regex: /^(table)([\s]+)([\w]+)([ ]+)({)([\s]*)$/,
          next: 'columns',
        },
        {
          token: function () {
            return ['support.class', 'b', 'tablename', 'b', 'opendef', 'b']
          },
          regex: /^(enum)([\s]+)([\w]+)([ ]+)({)([\s]*)$/,
          next: 'start',
        },
        {
          token: function () {
            return ['support.class', 'b']
          },
          regex: /^(Ref)(.*)$/,
          next: 'start',
        },
        {
          caseInsensitive: true,
        },
      ],
      columns: [
        {
          token: function () {
            return ['b', 'colname', 'b', 'string', 'b', 'modifiers']
          },
          regex: /^([\s]*)([\w_]+)([\s]+)([\w\d()]+)([\s]*)([[[\w\s,]+\]]*)$/,
          next: 'columns',
        },
        {
          token: function () {
            return ['b', 'colname', 'b', 'string']
          },
          regex: /^([\s]*)([\w_]+)([\s]+)([\w\d()]+)$/,
          next: 'columns',
        },
        {
          token: 'closedef',
          regex: '}',
          next: 'start',
        },
      ],
    }
  }
}

export default class CustomSqlMode extends ace.acequire('ace/mode/text')
  .Mode {
  constructor() {
    super()
    this.HighlightRules = CustomHighlightRules
  }
}
