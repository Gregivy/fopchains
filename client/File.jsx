File = React.createClass({
    render() {
        return (
            <a href={this.props.addresspattern+this.props.file._id} className="list-group-item">
                <h4 className="list-group-item-heading filename">{this.props.file.name}</h4>
                <p className="list-group-item-text">
                    <strong>Дата загрузки:</strong> <span className="filedesc">{(this.props.file.date).toLocaleString("ru")}</span><br />
                    <strong>Автор:</strong> <span className="filedesc">{this.props.file.author}</span><br />
                    <strong>Кол-во вариаций:</strong> <span className="filedesc">{this.props.file.variations.length}</span>
                </p>
            </a>
        );
    }
});