export default {
	'colors': {
		'black': '#000',
		'white': '#fff',
	},
	'position': {
		'static': 'static',
		'fixed': 'fixed',
		'absolute': 'absolute',
		'relative': 'relative',
		'sticky': 'sticky',
	},
	'inset': {
		'0': 0,
	},
	'top': {
		'0': 0,
	},
	'bottom': {
		'0': 0,
	},
	'left': {
		'0': 0,
	},
	'right': {
		'0': 0,
	},
	'vertical-align': {
		'align-baseline': 'baseline',
		'align-top': 'top',
		'align-middle': 'middle',
		'align-bottom': 'bottom',
		'align-text-top': 'text-top',
		'align-text-bottom': 'text-bottom',
		'align-sub': 'sub',
		'align-super': 'super',
	},
	'white-space': {
		'whitespace-normal': 'normal',
		'whitespace-nowrap': 'nowrap',
		'whitespace-pre': 'pre',
		'whitespace-pre-line': 'pre-line',
		'whitespace-pre-wrap': 'pre-wrap',
	},
	'float': {
		'float-right': 'right',
		'float-left': 'left',
		'float-none': 'none',
	},
	'text-align': {
		'text-left': 'left',
		'text-center': 'center',
		'text-right': 'right',
		'text-justify': 'justify',
	},
	'font-style': {
		'italic': 'italic',
		'not-italic': 'normal',
	},
	'font-size': function() {
		let out = {};
		let i = 0.5;
		while (i <= 6) {
			out[i.toString().replace('.', '-')] = i+'rem';
			if (i < 2) {
				i += 0.125;
			} else if (i < 4) {
				i += 0.25;
			} else {
				i += 0.5;
			}
		}
		return out;
	},
	'font-weight': {
		'100': 100,
		'200': 200,
		'300': 300,
		'400': 400,
		'500': 500,
		'600': 600,
		'700': 700,
		'800': 800,
		'900': 900,
	},
	'text-transform': {
		'lowercase': 'lowercase',
		'uppercase': 'uppercase',
		'capitalize': 'capitalize',
		'normalcase': 'none',
	},
	'text-decoration-line': {
		'underline': 'underline',
		'overline': 'overline',
		'line-through': 'line-through',
		'decoration-none': 'none',
	},
	'text-decoration-style': {
		'decoration-solid': 'solid',
		'decoration-double': 'double',
		'decoration-dotted': 'dotted',
		'decoration-dashed': 'dashed',
		'decoration-wavy': 'wavy',
	},
	'line-height': {
		'normal': 'normal',
		'1': 1,
		'1-5': 1.5,
	},
	'display': {
		'block': 'block',
		'inline-block': 'inline-block',
		'inline': 'inline',
		'flex': 'flex',
		'inline-flex': 'inline-flex',
		'table': 'table',
		'inline-table': 'inline-table',
		'table-caption': 'table-caption',
		'table-cell': 'table-cell',
		'table-column': 'table-column',
		'table-column-group': 'table-column-group',
		'table-footer-group': 'table-footer-group',
		'table-header-group': 'table-header-group',
		'table-row-group': 'table-row-group',
		'table-row': 'table-row',
		'grid': 'grid',
		'inline-grid': 'inline-grid',
		'contents': 'contents',
		'list-item': 'list-item',
		'hidden': 'none',
	},
	'table-layout': {
		'table-auto': 'fixed',
		'table-fixed': 'fixed',
	},
	'object-fit': {
		'object-contain': 'contain',
		'object-cover': 'cover',
		'object-fill': 'fill',
		'object-none': 'none',
		'object-scale-down': 'scale-down',
	},
	'object-position': {
		'object-bottom': 'bottom',
		'object-center': 'center',
		'object-left': 'left',
		'object-left-bottom': 'left bottom',
		'object-left-top': 'left top',
		'object-right': 'right',
		'object-right-bottom': 'right bottom',
		'object-right-top': 'right top',
		'object-top': 'top',
	},
	'overflow': {
		'overflow-hidden': 'hidden',
		'overflow-auto': 'auto',
	},
	'overflow-x': {
		'overflow-x-hidden': 'hidden',
		'overflow-x-auto': 'auto',
	},
	'overflow-y': {
		'overflow-y-hidden': 'hidden',
		'overflow-y-auto': 'auto',
	},
	'visibility': {
		'visible': 'visible',
		'invisible': 'hidden',
	},
	'flex-direction': {
		'flex-column': 'column',
		'flex-row-reverse': 'row-reverse',
		'flex-column-reverse': 'column-reverse',
	},
	'flex-wrap': {'flex-wrap': 'wrap'},
	'align-items': {
		'align-start': 'flex-start',
		'align-center': 'center',
		'align-end': 'flex-end',
		'align-baseline': 'baseline',
	},
	'align-content': {
		'content-start': 'flex-start',
		'content-center': 'center',
		'content-end': 'flex-end',
		'content-between': 'space-between',
		'content-around': 'space-around',
		'content-evenly': 'space-evenly',
	},
	'justify-content': {
		'justify-end': 'flex-end',
		'justify-center': 'center',
		'justify-between': 'space-between',
		'justify-around': 'space-around',
		'justify-evenly': 'space-evenly',
	},
	'justify-items': {
		'justify-items-start': 'start',
		'justify-items-end': 'end',
		'justify-items-center': 'center',
		'justify-items-stretch': 'stretch',
	},
	'flex': {
		'flex-1': '1 1 0%',
		'flex-auto': '1 1 auto',
		'flex-none': 'none',
	},
	'grid-template-columns': {
		'grid-cols-1': '1fr',
		'grid-cols-2': '1fr 1fr',
		'grid-cols-3': 'repeat(3, 1fr)',
		'grid-cols-4': 'repeat(4, 1fr)',
		'grid-cols-5': 'repeat(5, 1fr)',
		'grid-cols-6': 'repeat(6, 1fr)',
		'grid-cols-7': 'repeat(7, 1fr)',
		'grid-cols-8': 'repeat(8, 1fr)',
		'grid-cols-9': 'repeat(9, 1fr)',
		'grid-cols-10': 'repeat(10, 1fr)',
		'grid-cols-11': 'repeat(11, 1fr)',
		'grid-cols-12': 'repeat(12, 1fr)',
	},
	'grid-auto-flow': {
		'grid-flow-row': 'row',
		'grid-flow-col': 'column',
		'grid-flow-dense': 'dense',
		'grid-flow-row-dense': 'row dense',
		'grid-flow-col-dense': 'column dense',
	},
	'width': {
		'auto': 'auto',
		'1-10': '10%',
		'2-10': '20%',
		'3-10': '30%',
		'4-10': '40%',
		'5-10': '50%',
		'6-10': '60%',
		'7-10': '70%',
		'8-10': '80%',
		'9-10': '90%',
		'1-12': '8.333333%',
		'2-12': '16.666667%',
		'3-12': '25%',
		'4-12': '33.333333%',
		'5-12': '41.666667%',
		'6-12': '50%',
		'7-12': '58.333333%',
		'8-12': '66.666667%',
		'9-12': '75%',
		'10-12': '83.333333%',
		'11-12': '91.666667%',
		'full': '100%',
		'screen': '100vw',
		'min': 'min-content',
		'max': 'max-content',
		'fit': 'fit-content',
	},
	'height': {
		'auto': 'auto',
		'1-10': '10%',
		'2-10': '20%',
		'3-10': '30%',
		'4-10': '40%',
		'5-10': '50%',
		'6-10': '60%',
		'7-10': '70%',
		'8-10': '80%',
		'9-10': '90%',
		'1-12': '8.333333%',
		'2-12': '16.666667%',
		'3-12': '25%',
		'4-12': '33.333333%',
		'5-12': '41.666667%',
		'6-12': '50%',
		'7-12': '58.333333%',
		'8-12': '66.666667%',
		'9-12': '75%',
		'10-12': '83.333333%',
		'11-12': '91.666667%',
		'full': '100%',
		'screen': '100vh',
		'min': 'min-content',
		'max': 'max-content',
		'fit': 'fit-content',
	},
	'gap': function() {
		let out = {};
		let i = 0;
		while (i <= 10) {
			out[i.toString().replace('.', '-')] =(i ? i+'rem' : i);
			if (i < 5) {
				i += 0.25;
			} else {
				i += 0.5;
			}
		}
		return out;
	},
	'margin': function() {
		let out = {'auto': 'auto'};
		let i = 0;
		while (i <= 10) {
			out[i.toString().replace('.', '-')] =(i ? i+'rem' : i);
			if (i < 5) {
				i += 0.25;
			} else {
				i += 0.5;
			}
		}
		return out;
	},
	'padding': function() {
		let out = {};
		let i = 0;
		while (i <= 10) {
			out[i.toString().replace('.', '-')] =(i ? i+'rem' : i);
			if (i < 5) {
				i += 0.25;
			} else {
				i += 0.5;
			}
		}
		return out;
	},
	'border': {
		'1': '1px',
		'2': '2px',
	},
	'border-radius': {
		'': '9999px',
	},
	'border-style': {
		'border-dashed': 'dashed',
		'border-dotted': 'dotted',
		'border-double': 'double',
	},
	'background-attachment': {
		'bg-fixed': 'fixed',
		'bg-local': 'local',
	},
	'background-position': {
		'bg-top': 'top',
		'bg-center': 'center',
		'bg-bottom': 'bottom',
		'bg-left': 'left',
		'bg-left-top': 'left top',
		'bg-left-bottom': 'left bottom',
		'bg-right': 'right',
		'bg-right-top': 'right top',
		'bg-right-bottom': 'right bottom',
	},
	'background-repeat': {
		'bg-repeat': 'repeat',
		'bg-no-repeat': 'no-repeat',
		'bg-repeat-x': 'repeat-x',
		'bg-repeat-y': 'repeat-y',
		'bg-repeat-round': 'round',
		'bg-repeat-space': 'space',
	},
	'background-size': {
		'bg-cover': 'cover',
		'bg-contain': 'contain',
	},
	'z-index': {
		'10': '10',
		'20': '20',
		'30': '30',
		'40': '40',
		'50': '50',
		'100': '100',
	},
	'transition': {
		'transition': 'all 0.3s',
	},
	'transition-duration': {
		'500': '0.5s',
		'1000': '1s',
	},
	'transition-delay': {
		'100': '0.1s',
		'200': '0.2s',
		'300': '0.3s',
		'500': '0.5s',
		'1000': '1s',
	},
	'transition-timing-function': {
		'ease-linear': 'linear',
		'ease-in': 'ease-in',
		'ease-out': 'ease-out',
		'ease-in-out': 'ease-in-out',
	},
	'animation': {
		'none': 'none',
		'spin': 'spin 1s linear infinite',
		'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
		'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		'bounce': 'bounce 1s infinite',
	},
	'@keyframes': {
		'spin': {
			'0%': {'transform': 'rotate(0deg)'},
			'100%': {'transform': 'rotate(360deg)'}
		},
		'ping': {
			'75%,100%': {'transform': 'scale(2)', 'opacity': 0}
		},
		'pulse': {
			'0%,100%': {'opacity': 1},
			'50%': {'opacity': 0.5}
		},
		'bounce': {
			'0%,100%': {'transform': 'translateY(-25%)', 'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'},
			'50%': {'transform': 'translateY(0)', 'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'}
		},
	},
};