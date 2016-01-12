FileLoading = React.createClass({
    getInitialState() {
        return {file:null};
    },
    
    handleChange(e) {
        //this.setState({query: e.target.value});
        var files = e.target.files;
        //this.props.onFileChange({query: q});
        this.props.onFileSelect(files[0]);
        this.setState({file:files[0]});
    },
    render() {
        return (
            <form ref="fileform">
                <div className="form-group well">
                    <label>Загрузить файл: </label>
                    <input type="file" accept={this.props.accept} multiple={false} onChange={this.handleChange} className={this.props.loading?'hide':''} />
                    { this.props.loading ?
                        <div>
                            Загрузка...<br />
            {/*<ProgressBarWrapper file={this.state.file} />*/}
                        </div>
                    :''}
                </div>
            </form>
        );
    }
});