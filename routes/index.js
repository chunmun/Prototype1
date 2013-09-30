
/*
 * GET home page.
 */

exports.index = function(req, res) {
	console.log(req);
	res.render('index', { title: 'Prototype-1' });
};

exports.screen = function(req, res) {
	res.render('screen', { title: 'Prototype-1 Screen' });
};

exports.controller = function(req, res) {
	res.render('controller', { title: 'Prototype-1 Controller' });
}