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
            <v-input type="text" v-model="filter" placeholder="Filter..." @keydown.esc="filter = ''"></v-input>
        </div>
        
        <div class="items">
            <div class="item" v-for="item in filteredItems" @click="edit(item)"
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
                <div class="form-buttons">
                    <v-button @click="submit(editingItem)" :spin="writeLock">
                        Save
                    </v-button>
                    <v-button @click="remove(editingItem)" class="remove">
                        <fa icon="trash"></fa>
                    </v-button>
                </div>
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
import ConfigParser from 'src/components/ssh_config/parser'
import _ from 'lodash'

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
            let items = me.items
            
            if (me.filter.length > 0) {
                items = items.filter(item => item.host.indexOf(me.filter) > -1)
            }
            
            return _.sortBy(items, item => item.host)
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
            
            parser.parse().then(items => {
                me.items = items
            })
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
                    lines: [],
                    
                    _new: true
                }
                
                me.edit(item)
            })
        },
        edit (item) {
            let me = this
            
            me.editingItem = item
        },
        remove (item) {
            let me = this
            
            me.$swal({
                title: 'Remove ' + item.host,
                text: 'Are you sure?',
                type: 'error',
                confirmButtonText: 'Yes'
            }).then(result => {
                if (result.value === true) {
                    me.items.splice(me.items.indexOf(item), 1)
                    me.editingItem = null
                    
                    me.writeItems()
                }
            })
        },
        submit (item) {
            let me = this
            
            if (item._new === true) {
                me.items.push(item)
            }
            
            me.writeItems()
        }
    }
}
</script>