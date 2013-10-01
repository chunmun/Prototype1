
/*
 * GET home page.
 */

module.exports = {
	index : function(req, res) {
		res.render('index', { title: 'Prototype-1' });
	},

	choose : function(req, res) {
		var room = req.body.room;
		var type = req.body.type;
		res.redirect('/'+type+'/'+room);
	},

	screen : function(req, res) {
		res.render('screen', { title: 'Prototype-1 Screen' });
	},

	screenWithRoom : function(req, res) {
		res.render('screen', { title: 'Prototype-1 Screen' });
	},

	controller : function(req, res) {
		res.render('controller', { title: 'Prototype-1 Controller' });
	},

	controllerWithRoom : function(req, res) {
		res.render('controller', { title: 'Prototype-1 Controller' });
	},
};