module.exports = function (grunt) { 'use strict';
require('time-grunt')(grunt);
require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

const allJSFiles = 'lib/jokes.js';
const gruntfilePath = 'Gruntfile.js';

const cwd = './';
const jokes = './lib/jokes.js';
const es5js = './dist/build.es5.js';
const minjs = './dist/build.min.js';

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
    babel: {
        options: {
            presets: ['es2015-without-strict']
        },

        dist: {
            files: [{
                src: jokes,
                dest: es5js
            }]
        }
    },
	
    uglify: {
        build: {
            options: {
                screwIE8: true,
                drop_console: true,
                drop_debugger: true,
                sourceMap: false
            },

            files: [{
                expand: false,
                cwd: cwd,
                src: es5js,
                dest: minjs
            }]
        }
    },

    jshint: {
        files: [
            allJSFiles, 
            gruntfilePath
        ],
        options: {
            funcscope: true,
            notypeof: true,
            bitwise: true,
            nocomma: true,
            eqeqeq: true,
            maxparams: 3,
            freeze: true,
            esnext: true,
            shadow: true,
            strict: true,
            curly: true,
            noarg: true,
            maxdepth: 2
        },
    },
    
    "grunt-license-report": {
        output: {
            path: './report/licenses',
            format: 'html'
        }
    },

    todo: {
        options: {
            marks: [{
              name: "FIX",
              pattern: /FIXME/,
              color: "red"
            }, {
              name: "TODO",
              pattern: /TODO/,
              color: "yellow"
            }],
            file: 'report/report.md',
            githubBoxes: true,
            colophon: true,
            usePackage: true
        },
        src: [
            'lib/*',
            'test/*'
        ]
    },
    
    complexity: {
        generic: {
            src: [
                allJSFiles
            ],
            exclude: [],
            options: {
                breakOnErrors: false,
                jsLintXML: 'report/report.xml',        
                checkstyleXML: 'report/checkstyle.xml', 
                pmdXML: 'report/pmd.xml',               
                errorsOnly: false,        
                cyclomatic: [3, 7, 12],          
                halstead: [8, 13, 20],
                maintainability: 103,
                hideComplexFunctions: true,
                broadcast: false
            }
        }
    },
    
    cowsay: {
        moo: {
            options: {
               message: 'Grunt done without errors!',
                mood: (function () {
                    const array = ['b', 'd', 'g', 'p', 's', 't', 'w', 'y'];
                    
                    function random (min, max) {
                        return Math.floor(Math.random() * (max - min + 1) + min);
                    }
                    
                    return array[random(0, array.length - 1)];
                }())
            }
        }
    },

    exec: {
        mocha: 'mocha --harmony;',
        grep: 'echo \'grep for console.log\'; cd lib; grep -nr \'console.log\' .; echo \'\''
    },
	
    clean: [
        es5js
    ],
    
    'minor-major-milestone': {
        minor: {
            options: { elem: 'minor' }
        },
        major: {
            options: { elem: 'major'}
        },
        milestone: {
            options: { elem: 'milestone'}
        }
    }
});


// ---------------------------- Tasks ----------------------------
grunt.registerTask('default', [
    'babel',
    'uglify',
    'jshint',
    'complexity',
    'grunt-license-report',
    'todo',
    'exec:mocha',
    'exec:grep',
	'clean',
    'cowsay'
]);

grunt.registerTask('minor', ['minor-major-milestone:minor']);
grunt.registerTask('major', ['minor-major-milestone:major']);
grunt.registerTask('milestone', ['minor-major-milestone:milestone']);

};
