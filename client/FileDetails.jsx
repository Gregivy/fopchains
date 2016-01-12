FileDetails = React.createClass({
    getInitialState() {
        return {};
    },
    
    mixins: [ReactMeteorData],
    
    getMeteorData() {
        var handle = Meteor.subscribe("file", this.props.id);
        //Meteor.subscribe("realfiles");
        var file = Files.findOne(this.props.id);
        return {
            fileInfoLoading: ! handle.ready(),
            file: file,
            currentUser: Meteor.user()
        }
    },
    
    renderVariations() {
        var n = -1;
        return this.data.file.variations.map((variation) => {
            n++;
            if (n>0) return(
                <li key={variation} style={{margin:"10px"}}>
                    {this.data.currentUser && this.data.file.author==this.data.currentUser.username?<button className="btn btn-danger btn-xs" onClick={this.deleteFile} htmlFor={n+"|"+variation}>Удалить</button>:''}
                    <span> </span>
                    <a href={"/open/"+this.data.file._id+"/"+n}>{variation}</a>
                    
                </li>
            );
        });
    },
    
    deleteFile(e) {
        var forData = e.target.getAttribute("for");
        var n = parseInt(forData.split("|")[0]);
        var id = forData.split("|")[1];
        Realfiles.remove(id);
        Files.update(this.props.id,{$pull:{variations:id}});
    },
    
    deleteAllFileVar() {
        Meteor.call("deleteAllFileVar",this.props.id);
        FlowRouter.go('/files');
    },
    
    render() {
        if (this.data.fileInfoLoading) {
            return <LoadingSpinner />;
        }
        return (
            <div>
                <button className="btn btn-primary" onClick={window.history.length>0?function(){window.history.back()}:function(){FlowRouter.go('/files')}}>Назад</button>
                <span> </span>
                {this.data.currentUser && this.data.file.author==this.data.currentUser.username?<button className="btn btn-danger" onClick={this.deleteAllFileVar}>Удалить</button>:''}
                <h3>Файл {this.data.file.name}</h3>
                <strong>Дата загрузки:</strong> <span className="filedesc">{(this.data.file.date).toLocaleString("ru")}</span><br />
                <strong>Автор:</strong> <span className="filedesc">{this.data.file.author}</span><br />
                <strong>Кол-во вариаций:</strong> <span className="filedesc">{this.data.file.variations.length}</span>
                <hr />
                <h4><a href={"/open/"+this.data.file._id+"/0"}>Оригинал</a></h4>
                <h4>Вариации:</h4>
                <ol>
                    {this.renderVariations()}
                </ol>
            </div>
        );
    }
});