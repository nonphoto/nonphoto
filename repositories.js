jQuery.githubUser = function(username, callback) {
    jQuery.getJSON('https://api.github.com/users/' + username + '/repos?callback=?', callback)
}

jQuery.fn.loadRepositories = function(username) {
    this.html("<span>Querying GitHub for " + username + "'s repositories...</span>");

    var target = this;
    $.githubUser(username, function(data) {
	// Parse JSON
	var repos = data.data;
	sortByName(repos);

	// Write back to HTML
	var list = $('<ul/>');
	target.empty().append(list);
	$(repos).each(function() {
	    if (this.has_pages && this.name != username + '.github.io') {
		list.append('<li><a href="http://' + username + '.github.io/' + this.name +'">' + this.name + '</a></li>');
	    }
	});
    });

    function sortByName(repos) {
	repos.sort(function(a,b) {
	    return a.name - b.name;
	});
    }
};
