FileSearch = React.createClass({
    handleChange(e) {
        //this.setState({query: e.target.value});
        var q = e.target.value;
        this.props.onQueryChange({query: q});
    },
    render() {
        return (
            <div className="form-group">
                <input 
                    type="text"
                    onChange={this.handleChange}
                    className="form-control"
                    value={this.props.startvalue}
                    placeholder="Найти файл по имени..." />
            </div>
        );
    }
});