FlowRouter.route('/', {
    triggersEnter: [function(context, redirect) {
        redirect('/files');
    }],
    action(params) {
       
    }
});

FlowRouter.route('/files', {
    action(params, queryParams) {
        const containerElement = document.getElementById("render-target");
        let query = queryParams.q ? queryParams.q : '';
        ReactDOM.render(<FilesList query={query} />, containerElement);
    }
});
        
FlowRouter.route('/file/:id', {
    action(params, queryParams) {
        const containerElement = document.getElementById("render-target");
        const id = params.id;
        ReactDOM.render(<FileDetails id={id} />, containerElement);
    }
});
        
FlowRouter.route('/open/:id/:n', {
    action(params, queryParams) {
        const containerElement = document.getElementById("render-target");
        var id = params.id;
        var n = params.n;
        ReactDOM.unmountComponentAtNode(containerElement);
        ReactDOM.render(<FileOpen id={id} n={n} />, containerElement);
    }
});

FlowRouter.notFound = {
    action() {
        FlowRouter.go("/files");
    }
};