/**
 * This class represents a tiny and simple parser of the .ssh/config file
 *
 * It ignores:
 *   empty lines
 *   lines starting with #
 */

import fs from 'fs-extra'

export default class Parser {
    
    constructor (filename) {
        let me = this
        
        me.filename = filename
        me.content = ''
    }
    
    write (items) {
        let me = this
        let content = ''
    
        items.forEach(item => {
            content += 'Host ' + item.host
            content += '\n'
        
            item.content.split('\n').forEach(line => {
                content += '  ' + line.trim()
                content += '\n'
            })
        })
    
        return fs.writeFile(me.filename, content)
    }
    
    /**
     * Tries to read the given filename
     *
     * @returns {Promise<any>}
     */
    read () {
        let me = this
        
        return new Promise((resolve, reject) => {
            fs.exists(me.filename).then(result => {
                if (result === true) {
                    fs.readFile(me.filename).then(buffer => {
                        me.content = buffer.toString()
                        resolve()
                    })
                } else {
                    reject()
                }
            }).catch(reject)
        })
    }
    
    parse () {
        let me = this
        
        return new Promise((resolve, reject) => {
            me.read().then(() => {
                let lines = me.content.split('\n').map(item => item.trim())
                let current = null
                let items = []
                
                lines = lines.filter(line => line.length > 0 && line[0] !== '#')
    
                for (let i = 0, line; i < lines.length, line = lines[i]; i++) {
                    if (line.toLowerCase().indexOf('host ') === 0 || i === lines.length - 2) {
                        if (current !== null) {
                            if (i === lines.length - 2) {
                                current.lines.push(line)
                            }
                            
                            current.content = current.lines.join('\n')
                            
                            items.push(current)
                        }
                    }
                    
                    if (line.toLowerCase().indexOf('host ') === 0) {
                        current = {
                            host: line.substring(5),
                            lines: []
                        }
                    } else {
                        current.lines.push(line)
                    }
                }
    
                resolve(items)
            }).catch(reject)
        })
    }
    
}