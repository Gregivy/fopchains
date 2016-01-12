FilesList = React.createClass({
    getInitialState() {
        return {query:this.props.query,loadingInProccess:false,loadingPer:0};
    },
    
    mixins: [ReactMeteorData],
    
    getMeteorData() {
        var handle = Meteor.subscribe("files", this.state.query);
        Meteor.subscribe("realfiles");
        var files = Files.find({}, {sort: {date: -1}});
        return {
            filesListLoading: ! handle.ready(),
            files: files.fetch(),
            filesN: files.count(),
            currentUser: Meteor.user()
        }
    },
    
    renderFiles() {
        if (this.data.filesListLoading) {
            return <LoadingSpinner />;
        }
        
        if (this.data.filesN == 0) {
            return <span>Ничего не найдено</span>;
        }
        
        return this.data.files.map((file) => {
            return <File key={file._id} file={file} addresspattern="/file/" />;
        });
    },
    
    checkloading(id,filename) {
        var fileObj = Realfiles.findOne(id);
        if (fileObj) this.setState({loadingPer:fileObj.uploadProgress()});
        //if (fileObj) console.log(fileObj.uploadProgress());
        if (fileObj && fileObj.url()!=null) {
            //console.log(fileObj.url());
            Meteor.call("newFile",fileObj._id,filename);
            this.setState({loadingInProccess : false});
            ReactDOM.findDOMNode(this.refs.fileloading.refs.fileform).reset();
        } else {
            var _this = this;
            setTimeout(function() {_this.checkloading(id,filename);},1000);
        }
    },
    
    handleFileSelect(file) {
        this.setState({loadingInProccess : true,loadingPer:0});
        var _this = this;
        Realfiles.insert(file, function (err, fileObj) {
            //console.log(err);
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            //_this.setState({file:fileObj});
            //console.log(fileObj.url());
            _this.checkloading(fileObj._id,file.name);
            //_this.setState({loadingInProccess : false});
            //ReactDOM.findDOMNode(_this.refs.fileloading.refs.fileform).reset();
        });
    },
    
    handleQueryChange(q) {
        var query = q.query;
        this.setState({query:query});
        FlowRouter.setQueryParams({q: query!=''?query:null});
    },
    
    render() {
        return (
            <div>
                <h1>Список файлов</h1>
                { this.data.currentUser ?
                    <FileLoading onFileSelect={this.handleFileSelect} loading={this.state.loadingInProccess} accept="text/xml" ref="fileloading" /> : ''
                }
                { this.state.loadingInProccess ?
                    <ProgressBar percantage={this.state.loadingPer} /> : ''
                }
                <FileSearch onQueryChange={this.handleQueryChange} startvalue={this.props.query} />
                <div className="list-group">
                    {this.renderFiles()}
                </div>
            </div>
        );
    }
});