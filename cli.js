#!/usr/bin/env node

import { argv } from 'process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const cmd = (argv[2] ? argv[2] : 'init');
const args = [];
for (let i = 3; i < argv.length; i++) {
	args.push(argv[i]);
}

const commands = {
	init: {
		run: init,
		desc: 'Создание файла конфигурации',
	},
	generate: {
		run: generate,
		desc: 'Генерация CSS файла',
		args: {
			'-o': 'Оптимизация файла',
		}
	},
	help: {
		run: help,
		desc: 'Помощь',
	},
};

/**
 * Создание файла конфигурации
 */
function init() {
	const from_path = path.resolve(argv[1], '../config.js');
	const to_path = './andorcss.config.mjs';
	if (fs.existsSync(to_path)) {
		console.log('Файл конфигурации уже существует');
	} else {
		fs.copyFile(from_path, to_path, function (err) {
			if (err) {
				console.error(err);
			} else {
				console.log('Файл конфигурации andorcss.config.mjs успешно создан');
			}
		});
	}
}

/**
 * Генерация CSS файла
 */
async function generate() {
	const config = (await import('./config.js')).default;
	const template = (await import('./template.js')).default;
	const { version } = JSON.parse(fs.readFileSync(path.resolve(argv[1], '../package.json'), 'utf8'));

	if (fs.existsSync('./andorcss.config.mjs')) {
		const user_config = (await import(pathToFileURL('./andorcss.config.mjs').href)).default;
		for (let key in user_config) config[key] = user_config[key];
	}

	if (config.template) for (let prop in config.template) template[prop] = config.template[prop];

	for (let prop in template) {
		if (typeof template[prop] === 'function') template[prop] = template[prop]();
	}

	if (config.extend) {
		for (let prop in config.extend) {
			for (let key in config.extend[prop]) template[prop][key] = config.extend[prop][key];
		}
	}

	const prefixes = {
		'font-size': 'fs',
		'font-weight': 'fw',
		'line-height': 'lh',
		'margin': 'm',
		'padding': 'p',
		'gap': 'g',
		'width': 'w',
		'max-width': 'max-w',
		'min-width': 'min-w',
		'height': 'h',
		'max-height': 'max-h',
		'min-height': 'min-h',
		'border-radius': 'rounded',
		'border': 'b',
		'background-color': 'bg',
		'border-color': 'bc',
		'transition-duration': 'duration',
		'transition-delay': 'delay',
		'animation': 'animate',
		'z-index': 'z',
	};

	const rules = {};

	const handlers = {
		'default': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = [];
				if (prefixes[prop]) cl.push(prefixes[prop]);
				if (key) cl.push(key);
				if (!cl.length) continue;
				rules['.' + cl.join('-')] = prop + ':' + values[key];
			}
		},
		'margin': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : 'm');
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 't-' + key] = prop + '-top:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 'b-' + key] = prop + '-bottom:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'l-' + key] = prop + '-left:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'r-' + key] = prop + '-right:' + values[key];
			}
		},
		'padding': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : 'p');
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 't-' + key] = prop + '-top:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 'b-' + key] = prop + '-bottom:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'l-' + key] = prop + '-left:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'r-' + key] = prop + '-right:' + values[key];
			}
		},
		'gap': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : 'g');
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key] = 'row-' + prop + ':' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key] = 'column-' + prop + ':' + values[key];
			}
		},
		'border': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : 'b');
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 't-' + key] = prop + '-top-width:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'y-' + key + ',.' + cl + 'b-' + key] = prop + '-bottom-width:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'l-' + key] = prop + '-left-width:' + values[key];
				rules['.' + cl + '-' + key + ',.' + cl + 'x-' + key + ',.' + cl + 'r-' + key] = prop + '-right-width:' + values[key];
			}
		},
		'@keyframes': function (prop) {
			const values = template[prop];
			for (let key in values) {
				if (!key) continue;
				let out = '';
				for (let pos in values[key]) {
					let styles = '';
					for (let prop in values[key][pos]) {
						if (styles) styles += ';';
						styles += prop + ':' + values[key][pos][prop];
					}
					out += pos + '{' + styles + '}';
				}
				rules['@keyframes ' + key] = out;
			}
		},
		'colors': function (prop) {
			const values = template[prop];
			rules[':root'] = '';
			const props = ['color', 'background-color', 'border-color'];

			for (let key in values) {
				const color = values[key];
				if (rules[':root']) rules[':root'] += ';';
				rules[':root'] += '--' + key + ':' + color;

				for (let i = 0; i < props.length; i++) {
					const prop = props[i];
					let cl = (prefixes[prop] ? prefixes[prop] : prop);
					rules['.' + cl + '-' + key + ',.hover-' + cl + '-' + key + ':hover'] = prop + ':var(--' + key + ')';
				}
			}
		},
		'inset': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : 'inset');
				rules['.' + cl] = 'top:' + values[key] + ';' + 'bottom:' + values[key] + ';' + 'left:' + values[key] + ';' + 'right:' + values[key];
			}
		},
		'top': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop);
				rules['.' + cl] = prop + ':' + values[key];
			}
		},
		'bottom': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop);
				rules['.' + cl] = prop + ':' + values[key];
			}
		},
		'left': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop);
				rules['.' + cl] = prop + ':' + values[key];
			}
		},
		'right': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop);
				rules['.' + cl] = prop + ':' + values[key];
			}
		},
	}

	// Выполнение обработчиков
	for (let prop in template) {
		const handler = (handlers[prop] ? prop : 'default');
		handlers[handler](prop);
	}

	let out = '/**! @andorcode/andorcss v' + version + ' */\n*,::after,::before{box-sizing:border-box;border:0 solid currentColor}html{line-height:normal;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;height:100%;-moz-tab-size:4;tab-size:4;font-family:var(--font,Roboto),Arial,Helvetica,sans-serif}body{margin:0;line-height:inherit;min-height:100%}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit;margin:0}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,Consolas,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0;outline:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background:0 0;cursor:pointer}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,hr,legend,menu,ol,p,pre,ul{margin:0;padding:0}menu,ol,ul{list-style:none}textarea{resize:vertical}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block}img,video{max-width:100%;height:auto}[hidden]{display:none!important}';

	if (args.indexOf('-o') != -1) {
		const content = [];

		if (config.content && config.content_ext) {
			function find_files(path) {
				const files = fs.readdirSync(path, { withFileTypes: true });
				for (let i = 0; i < files.length; i++) {
					if (files[i].isDirectory()) {
						find_files(path + files[i].name + '/');
					} else if (files[i].isFile()) {
						let ext = files[i].name.split('.');
						ext = ext[ext.length - 1];
						if (config.content_ext.indexOf(ext) != -1) content.push(fs.readFileSync(path + files[i].name, 'utf8'));
					}
				}
			}
			for (let i = 0; i < config.content.length; i++) {
				find_files(config.content[i]);
			}
		}

		for (let r in rules) {
			if (r.slice(0, 1) === '.') {
				let cl = r.split(',');
				let finded = false;
				for (let i = 0; i < cl.length; i++) {
					let find = cl[i].slice(1);
					for (let j = 0; j < content.length; j++) {
						if (content[j].indexOf(find) != -1) {
							finded = true;
							break;
						}
					}
					if (finded) break;
				}
				if (finded) out += r + '{' + rules[r] + '}';
			} else {
				out += r + '{' + rules[r] + '}';
			}
		}

		if (config.media) {
			for (let key in config.media) {
				let media_out = '';
				for (let r in rules) {
					if (r.slice(0, 1) !== '.') continue;
					let cl = r.split(',');
					let finded = false;
					for (let i = 0; i < cl.length; i++) {
						cl[i] = '.' + key + '-' + cl[i].slice(1);
						let find = cl[i].slice(1);
						for (let j = 0; j < content.length; j++) {
							if (content[j].indexOf(find) != -1) {
								finded = true;
								break;
							}
						}
						if (finded) break;
					}
					if (finded) media_out += cl.join(',') + '{' + rules[r] + '}';
				}
				if (media_out) out += '@media (max-width:' + config.media[key] + '){' + media_out + '}';
			}
		}
	} else {
		for (let r in rules) {
			out += r + '{' + rules[r] + '}';
		}

		if (config.media) {
			for (let key in config.media) {
				let media_out = '';
				for (let r in rules) {
					if (r.slice(0, 1) !== '.') continue;
					let cl = r.split(',');
					for (let i = 0; i < cl.length; i++) {
						cl[i] = '.' + key + '-' + cl[i].slice(1);
					}
					media_out += cl.join(',') + '{' + rules[r] + '}';
				}
				if (media_out) out += '@media (max-width:' + config.media[key] + '){' + media_out + '}';
			}
		}
	}

	fs.writeFile(config.layout_path, out, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log('Файл макета успешно сгенерирован');
		}
	});
}

/**
 * Помощь
 */
function help() {
	let out = 'Доступные команды:';
	for (let key in commands) {
		out += '\n' + key + ': ' + commands[key].desc;
		if (commands[key].args) {
			for (let a in commands[key].args) {
				out += '\n  ' + a + ': ' + commands[key].args[a];
			}
		}
	}
	console.log(out);
}

// Выполнение команды
if (commands[cmd]) {
	commands[cmd].run();
} else {
	console.error('Команда ' + cmd + ' не найдена.\n');
	help();
}