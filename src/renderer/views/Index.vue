<template>
    <div class="is--index">
        
        <div class="header">
            <ul class="menu">
                <li @click="create">
                    <fa icon="plus"></fa>
                    Create
                </li>
            </ul>
        </div>

        <div class="filename">
            <label for="filename">
                .ssh/config Destination
            </label>
            <v-file id="filename" v-model="config.filename"></v-file>
        </div>
        
        <div class="item-filter">
            <v-input type="text" v-model="filter" placeholder="Filter..."></v-input>
        </div>
        
        <div class="items">
            <div class="item" v-for="item in filteredItems" @click="editingItem = item"
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
                <div class="form-buttons">
                    <v-button @click="writeItems" :spin="writeLock">
                        Save
                    </v-button>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import ConfigParser from 'src/components/ssh_config/parser'

export default {
    name: 'index',
    data () {
        return {
            items: [],
            editingItem: null,
            
            config: {
                filename: '',
                yamlConfig: ''
            },
            
            writeLock: false,
            filter: ''
        }
    },
    computed: {
        filteredItems() {
            let me = this
            
            if (!me.filter) {
                return me.items
            }
            
            return me.items.filter(item => item.host.indexOf(me.filter) > -1)
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
    mounted () {
        let me = this
        
        me.config = me.$config.get('config', me.config)
    },
    methods: {
        readItems () {
            let me = this
            let parser = new ConfigParser(me.config.filename)
            
            parser.parse().then(items => me.items = items)
        },
        writeItems () {
            let me = this
            let parser = new ConfigParser(me.config.filename)
            
            me.writeLock = true
            parser.write(me.items).then(() => me.writeLock = false)
        },
        
        create () {
            let me = this
            
            me.filter = ''
            
            me.$nextTick(() => {
                let item = {
                    host: '',
                    content: '',
                    lines: []
                }
                
                me.items.push(item)
                me.editingItem = item
            })
        }
    }
}
</script>