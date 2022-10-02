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
		desc: 'Генерация CSS',
		args: {
			'-o': 'Оптимизация CSS',
		}
	},
	help: {
		run: help,
		desc: 'Помощь',
	},
};

// Выполнение команды
if (commands[cmd]) {
	commands[cmd].run();
} else {
	console.error('Команда ' + cmd + ' не найдена.\n');
	help();
}

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
	const template = (await import('./template.js')).default;
	const { version } = JSON.parse(fs.readFileSync(path.resolve(argv[1], '../package.json'), 'utf8'));

	if (!fs.existsSync('./andorcss.config.mjs')) return console.error('Файл конфигурации не найден. Запустите команду init для его создания.');

	const config = (await import(pathToFileURL('./andorcss.config.mjs').href)).default;

	if (config.template) {
		for (let prop in config.template) template[prop] = config.template[prop];
	}

	for (let prop in template) {
		if (typeof template[prop] === 'function') template[prop] = template[prop]();
	}

	if (config.extend) {
		for (let prop in config.extend) {
			for (let key in config.extend[prop]) template[prop][key] = config.extend[prop][key];
		}
	}

	let optimize = false;
	let content = '';
	if (args.indexOf('-o') != -1) {
		optimize = true;
		if (config.content && config.content_ext) {
			for (let i = 0; i < config.content.length; i++) {
				find_files(config.content[i]);
			}
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

	const classes = {};
	const class_groups = {};
	let css_out = '/**! @andorcode/andorcss v' + version + ' */\n*,::after,::before{box-sizing:border-box;border:0 solid currentColor}html{line-height:normal;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;height:100%;-moz-tab-size:4;tab-size:4;font-family:' + (config.main_font ? '"' + config.main_font + '",' : '') + 'Arial,Helvetica,sans-serif}body{margin:0;line-height:inherit;min-height:100%}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit;margin:0}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,Consolas,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0;outline:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background:0 0;cursor:pointer}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,hr,legend,menu,ol,p,pre,ul{margin:0;padding:0}menu,ol,ul{list-style:none}textarea{resize:vertical}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block}img,video{max-width:100%;height:auto}[hidden]{display:none!important}';

	if (config.colors) {
		let vars_out = '';
		const props = ['color', 'background-color', 'border-color'];
		for (let key in config.colors) {
			const color = config.colors[key];
			if (vars_out) vars_out += ';';
			vars_out += '--' + key + ':' + color;

			for (let i = 0; i < props.length; i++) {
				const prop = props[i];
				let px = (prefixes[prop] ? prefixes[prop] : prop);
				let cl = px + '-' + key;
				let clh = 'hover-' + px + '-' + key;
				classes[cl] = '{' + prop + ':var(--' + key + ')}';
				class_groups[cl] = [clh + ':hover'];
			}
		}
		css_out += ':root{' + vars_out + '}';
	}

	if (config.fonts) {
		for (let key in config.fonts) {
			for (let i = 0; i < config.fonts[key].length; i++) {
				const font = config.fonts[key][i];
				css_out += '@font-face{font-family:"' + key + '"';
				if (font.display) css_out += ';font-display:' + font.display + '';
				let src_out = '';
				for (let j = 0; j < font.src.length; j++) {
					if (src_out) src_out += ',';
					let ext = font.src[j].split('.'); ext = ext[ext.length - 1];
					let format = ext;
					if (ext === 'ttf') {
						format = 'truetype';
					} else if (ext === 'otf') {
						format = 'opentype';
					}
					src_out += 'url("' + font.src[j] + '") format("' + format + '")';
				}
				css_out += ';src:' + src_out;
				if (font.weight) css_out += ';font-weight:' + font.weight;
				if (font.style) css_out += ';font-style:' + font.style;
				css_out += '}';
			}
		}
	}

	const handlers = {
		'default': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : '');
				if (key) cl += (cl.length ? '-' : '') + key;
				if (!cl.length) continue;
				classes[cl] = '{' + prop + ':' + values[key] + '}';
			}
		},
		'margin': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let px = (prefixes[prop] ? prefixes[prop] : prop);
				classes[px + '-' + key] = '{' + prop + ':' + values[key] + '}';
				classes[px + 'y-' + key] = '{' + prop + '-top:' + values[key] + ';' + prop + '-bottom:' + values[key] + '}';
				classes[px + 'x-' + key] = '{' + prop + '-left:' + values[key] + ';' + prop + '-right:' + values[key] + '}';
				classes[px + 't-' + key] = '{' + prop + '-top:' + values[key] + '}';
				classes[px + 'b-' + key] = '{' + prop + '-bottom:' + values[key] + '}';
				classes[px + 'l-' + key] = '{' + prop + '-left:' + values[key] + '}';
				classes[px + 'r-' + key] = '{' + prop + '-right:' + values[key] + '}';
			}
		},
		'gap': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let px = (prefixes[prop] ? prefixes[prop] : prop);
				classes[px + '-' + key] = '{' + prop + ':' + values[key] + '}';
				classes[px + 'y-' + key] = '{row-' + prop + ':' + values[key] + '}';
				classes[px + 'x-' + key] = '{column-' + prop + ':' + values[key] + '}';
			}
		},
		'border': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let px = (prefixes[prop] ? prefixes[prop] : prop);
				classes[px + '-' + key] = '{border-width:' + values[key] + '}';
				classes[px + 'y-' + key] = '{border-top-width:' + values[key] + ';border-bottom-width:' + values[key] + '}';
				classes[px + 'x-' + key] = '{border-left-width:' + values[key] + ';border-right-width:' + values[key] + '}';
				classes[px + 't-' + key] = '{border-top-width:' + values[key] + '}';
				classes[px + 'b-' + key] = '{border-bottom-width:' + values[key] + '}';
				classes[px + 'l-' + key] = '{border-left-width:' + values[key] + '}';
				classes[px + 'r-' + key] = '{border-right-width:' + values[key] + '}';
			}
		},
		'@keyframes': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let out = '';
				for (let pos in values[key]) {
					let styles = '';
					for (let prop in values[key][pos]) {
						if (styles) styles += ';';
						styles += prop + ':' + values[key][pos][prop];
					}
					out += pos + '{' + styles + '}';
				}
				css_out += '@keyframes ' + key + '{' + out + '}';
			}
		},
		'inset': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop) + '-' + key;
				classes[cl] = '{top:' + values[key] + ';' + 'bottom:' + values[key] + ';' + 'left:' + values[key] + ';' + 'right:' + values[key] + '}';
			}
		},
		'top': function (prop) {
			const values = template[prop];
			for (let key in values) {
				let cl = (prefixes[prop] ? prefixes[prop] : prop) + '-' + key;
				classes[cl] = '{' + prop + ':' + values[key] + '}';
			}
		},
	}
	handlers['padding'] = handlers['margin'];
	handlers['bottom'] = handlers['top'];
	handlers['left'] = handlers['top'];
	handlers['right'] = handlers['top'];

	// Выполнение обработчиков
	for (let prop in template) {
		const handler = (handlers[prop] ? prop : 'default');
		handlers[handler](prop);
	}

	for (let cl in classes) {
		let cl_full = '';
		if (!optimize || (optimize && find_class(cl))) cl_full = cl;
		if (class_groups[cl]) {
			for (let i = 0; i < class_groups[cl].length; i++) {
				let clg = class_groups[cl][i];
				if (optimize && !find_class(clg.split(':')[0])) continue;
				if (cl_full) {
					cl_full += ',.' + clg;
				} else {
					cl_full += clg;
				}
			}
		}
		if (cl_full) css_out += '.' + cl_full + classes[cl];
	}

	if (config.media) {
		for (let key in config.media) {
			let media_out = '';
			for (let cl in classes) {
				let new_cl = key + '-' + cl;
				let cl_full = '';
				if (!optimize || (optimize && find_class(new_cl))) cl_full = new_cl;
				if (class_groups[cl]) {
					for (let i = 0; i < class_groups[cl].length; i++) {
						let clg = key + '-' + class_groups[cl][i];
						if (optimize && !find_class(clg.split(':')[0])) continue;
						if (cl_full) {
							cl_full += ',.' + clg;
						} else {
							cl_full += clg;
						}
					}
				}
				if (cl_full) media_out += '.' + cl_full + classes[cl];
			}
			if (media_out) css_out += '@media (max-width:' + config.media[key] + '){' + media_out + '}';
		}
	}

	// Создание файла стилей
	fs.writeFile((optimize ? config.layout_path.replace('.css', '.min.css') : config.layout_path), css_out, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log('Файл макета успешно сгенерирован');
		}
	});

	/**
	 * Поиск файлов в папке
	 */
	function find_files(path) {
		const files = fs.readdirSync(path, { withFileTypes: true });
		for (let i = 0; i < files.length; i++) {
			if (files[i].isDirectory()) {
				find_files(path + files[i].name + '/');
			} else if (files[i].isFile()) {
				let ext = files[i].name.split('.');
				ext = ext[ext.length - 1];
				if (config.content_ext.indexOf(ext) != -1) content += fs.readFileSync(path + files[i].name, 'utf8');
			}
		}
	}

	/**
	 * Поиск класса в файлах
	 */
	function find_class(cl) {
		const reg = new RegExp('["\' ]' + cl + '["\' ]');
		return reg.test(content);
	}
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