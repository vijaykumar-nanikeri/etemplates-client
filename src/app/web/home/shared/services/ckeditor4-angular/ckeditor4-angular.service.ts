import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Ckeditor4AngularService {
  editorConfig = {
    extraPlugins: `
      bidi,
      colorbutton,
      colordialog,
      templates,
      find,
      font,
      smiley,
      justify,
      preview,
      print,
      exportpdf`,
    toolbar: [
      ['Source', 'Preview', 'Templates', 'Print', 'ExportPdf'],
      ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
      ['Undo', 'Redo'],
      ['Find', 'Replace', 'SelectAll', 'Scayt'],
      ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'],
      ['CopyFormatting', 'RemoveFormat'],
      ['NumberedList', 'BulletedList'],
      ['Outdent', 'Indent'],
      ['Blockquote'],
      ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
      ['BidiLtr', 'BidiRtl'],
      ['Link', 'Unlink'],
      ['Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
      ['Styles', 'Format', 'Font', 'FontSize'],
      ['TextColor', 'BGColor'],
      ['Maximize'],
    ],
    removeButtons: '',
    exportPdf_fileName: 'eTemplate.pdf',
  };

  constructor() {}

  getConfig() {
    return this.editorConfig;
  }
}
