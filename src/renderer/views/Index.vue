<template>
    <div class="is--index">

        <div class="filename">
            <label for="filename">
                .ssh/config Destination
            </label>
            <v-file id="filename" v-model="config.filename"></v-file>
        </div>

        <div class="input-editor">
            <codemirror v-model="config.yamlConfig" :options="editorConfig"></codemirror>
        </div>

        <div class="output">

        </div>

    </div>
</template>

<script>
import fs from 'fs-extra'

export default {
    name: 'index',
    data() {
        return {
            editorConfig: {
                tabSize: 4,
                mode: 'text/x-yaml',
                lineNumbers: true,
                line: true,
            },

            config: {
                filename: '',
                yamlConfig: ''
            }
        }
    },
    watch: {
        config: {
            deep: true,
            handler (config) {
                let me = this

                me.$config.set('config', config)
            }
        }
    },
    mounted() {
        let me = this

        me.config = me.$config.get('config', me.config)

        // console.log(fs.readFileSync(me.filename).toString())
    }
}
</script>