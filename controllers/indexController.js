module.exports = (app) => {
app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};