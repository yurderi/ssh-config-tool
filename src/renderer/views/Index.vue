<template>
    <div class="is--index">

        <div class="filename">
            <label for="filename">
                .ssh/config Destination
            </label>
            <v-file id="filename" v-model="config.filename"></v-file>
        </div>
        
        <div class="items">
            <div class="item" v-for="item in items" @click="editingItem = item"
                :class="{ active: item === editingItem }">
                <div class="item-host">
                    {{ item.host }}
                </div>
                <div class="item-lines">
                    {{ item.lines.length }}
                </div>
            </div>
        </div>
        
        <div class="editor">
            <div class="editor-content" v-if="editingItem">
                <div class="form-item">
                    <label for="host">
                        Host (alias)
                    </label>
                    <v-input type="text" id="host" v-model="editingItem.host"></v-input>
                </div>
                <div class="form-item">
                    <label for="content">
                        Definition
                    </label>
                    <v-input type="textarea" id="content" v-model="editingItem.content"></v-input>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import fs from 'fs-extra'
import ConfigParser from 'src/components/ssh_config/parser'

export default {
    name: 'index',
    data() {
        return {
            items: [],
            editingItem: null,
            
            editorConfig: {
                tabSize: 4,
                mode: 'text/x-yaml',
                lineNumbers: true,
                line: true,
            },
            config: {
                filename: '',
                yamlConfig: ''
            },
            configContent: ''
        }
    },
    watch: {
        config: {
            deep: true,
            handler (config) {
                let me = this

                me.$config.set('config', config)
                me.readItems()
            }
        }
    },
    mounted() {
        let me = this

        me.config = me.$config.get('config', me.config)
    },
    methods: {
        readItems () {
            let me = this
            let parser = new ConfigParser(me.config.filename)
            
            parser.parse().then(items => me.items = items)
        }
    }
}
</script>