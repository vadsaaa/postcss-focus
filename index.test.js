const plugin = require('./');

const postcss = require('postcss');

function run(input, output) {
    return postcss([ plugin ]).process(input).then( result => {
        expect(result.css).toEqual(output);
        expect(result.warnings().length).toEqual(0);
    });
}

it('adds focus selector', () => {
    return run('a:hover, b {}', 'a:hover, b, a:focus {}');
});

it('adds focus selector', () => {
    return run(
        'a:hover, b:hover {}',
        'a:hover, b:hover, a:focus, b:focus {}'
    );
});

it('ignores hover selector because of focus', () => {
    return run(
        '.foo:hover {} .foo:focus {} ' +
            'a:hover, b:hover {} ' +
            'b:focus {} ' +
            '@media { b:hover {} }',
        '.foo:hover {} .foo:focus {} ' +
            'a:hover, b:hover, a:focus {} ' +
            'b:focus {} ' +
            '@media { b:hover, b:focus {} }'
    );
});
