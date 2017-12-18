namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameterImage extends PromptParameter {
            public options: Array<PromptParameterOption>;
            private _value: PromptParameterImageResult;

            constructor(key: string, title: string, value?: PromptParameterImageResult, placeholder?: string) {
                super(key, title, value, placeholder);
                if (value) {
                    this._value = value;
                }
            }

            public parseValue() {
                this.value = this._value;
                this.$control = null
                delete this._$control;
                this._value = null;
                delete this._value;
            }

            protected getEditor() {
                var field = this;
                var img = this.value && this.value.fileContent ? this.value.fileContent : "";
                var $editor = $(`
                <div class='bre-image-input'>
                    <label for="${this.key}">
                        ${this.placeholder}
                    </label>                        
                    <img src="${img}"/>                    
                    <input type="file" id="${this.key}" class="bre-input" placeholder="${this.placeholder}">
                </div>
                <small class='bre-image-input-filename'></small>`);

                var $file = $('input', $editor);
                var $filePreview = $('img', $editor);
                var $fileName = $('.bre-image-input-filename', $editor);

                var value = this.value as PromptParameterImageResult;
                if (value) {
                    $filePreview.attr('src', value.fileContent);
                    $filePreview.addClass('bre-loaded');
                    $fileName.text(value.fileInfo.name);
                }

                $file.change(function () {
                    var fileInput = this;
                    if (fileInput.files && fileInput.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (ev) {
                            let target: any = ev.target;
                            field._value = new PromptParameterImageResult();
                            field._value.fileContent = target.result;
                            field._value.fileInfo = new PromptParameterImageResultFile(fileInput.files[0]);

                            $filePreview.attr('src', field._value.fileContent);
                            $filePreview.addClass('bre-loaded');
                            $fileName.text(field._value.fileInfo.name);
                        }

                        reader.readAsDataURL(fileInput.files[0]);
                    }
                });

                return $editor;
            }
        }
    }
}