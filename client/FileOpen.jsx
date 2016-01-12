FileOpen = React.createClass({
    getInitialState() {
        return {filecontent:"",loaded:false,operations:[]};
    },
    
    setFileContent(fileObj) {
        var _this = this;
        Meteor.call("fileContent",fileObj.variations[this.props.n],function (error, result) {
            //console.log("error "+error);
            //console.log(result);
            _this.setState({filecontent:result,loaded:true});
        });
    },
    
    mixins: [ReactMeteorData],
    
    getMeteorData() {
        var handle2 = Meteor.subscribe("operations");
        var handle3 = Meteor.subscribe("chains");
        var handle1 = Meteor.subscribe("file", this.props.id);
        Meteor.subscribe("realfiles");
        var file = Files.findOne(this.props.id);
        //console.log(file);
        return {
            fileInfoLoading: ! handle1.ready() || ! handle2.ready() || ! handle3.ready(),
            file: file,
            ops: Operations.find({}).fetch(),
            chains: Chains.find({}).fetch(),
            //realfile: realfile,
            currentUser: Meteor.user()
        }
    },
    
    handleParamsChange(e) {
        var forData = e.target.getAttribute("for");
        var n = parseInt(forData.split("|")[0]);
        var m = parseInt(forData.split("|")[1]);
        console.log(n,m);
        var paramid = e.target.name;
        var paramvalue = e.target.value;
        var operations = this.state.operations;
        if (m==-1) {operations[n].params[paramid] = paramvalue;}
        else {operations[m].operations[n].params[paramid] = paramvalue;}
        console.log(operations);
        this.setState({operations:operations});
        //this.props.onParamsChange(params,this.props.n);
        //console.log(p);
        //var operations = this.state.operations;
        //operations[n-1].params = p;
        //this.setState({operations:operations});
    },
    
    handleOpChange(e) {
        var forData = e.target.getAttribute("for");
        var n = parseInt(forData.split("|")[0]);
        var m = parseInt(forData.split("|")[1]);
        var op = e.target.value;
        var operations = this.state.operations;
        if (m==-1) {
            operations[n].id = op;
            operations[n].params = {};
        } else {
            operations[m].operations[n].id = op;
            operations[m].operations[n].params = {};
        }
        console.log(operations);
        this.setState({operations:operations});
        //var operations = this.state.operations;
        //operations[n-1].id = o;
        //this.setState({operations:operations});
    },

    handleChainChange(e) {
        var forData = e.target.getAttribute("for");
        var n = parseInt(forData);
        var chain = e.target.value;
        var operations = this.state.operations;
        operations[n].id = chain;
        var _this = this;
        var mychain = this.data.chains.find(function(el,i,a){
            return el._id == _this.state.operations[n].id;
        });
        operations[n].operations = mychain.operations;
        console.log(operations);
        this.setState({operations:operations});
        //var operations = this.state.operations;
        //operations[n-1].id = o;
        //this.setState({operations:operations});
    },
    
    renderSelect(data) {
        return data.map((op) => {
            return <option key={op._id} value={op._id}>{op.name}</option>;
        });
    },
    
    renderParams(n,m) {
        var _this = this;
        if (m==-1) {
            var myop = this.data.ops.find(function(el,i,a){
                console.log(el._id,_this.state.operations[n].id);
                return el._id == _this.state.operations[n].id;
            });
        } else {
            var myop = this.data.ops.find(function(el,i,a){
                console.log(el._id,_this.state.operations[m].operations[n].id);
                return el._id == _this.state.operations[m].operations[n].id;
            });
        }
        console.log(this.state.operations);
        //myop = myop?myop:{id:this.props.oplist[0]._id,params:this.props.oplist[0].params};
        return myop.params.map((param) => {
            return (<div key={param.id} className="form-group" style={{width:"100%"}}>
                <label className="col-sm-2 control-label">{param.name}</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        name={param.id}
                        value={m==-1?this.state.operations[n].params[param.id]:this.state.operations[m].operations[n].params[param.id]}
                        htmlFor={n+"|"+m}
                        style={{width:"100%"}}
                        onChange={this.handleParamsChange}
                        className="form-control" />
                </div>
            </div>);
        });
    },
    
    renderOperations(ops,m) {
        var n = -1;
        return ops.map((op) => {
            n++;
            //return <Operation key={Math.random()} opid={op.id} opparams={op.params} oplist={this.data.ops} n={n} onParamsChange={this.handleParamsChange} onOpChange={this.handleOpChange} />;
            
            if (op.type=="chain") { 
                return (
                <li className="operation" key={n}>
                <div className="inside">
                    <div className="form-inline">
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-addon">Цепочка: </div>
                                <select onChange={this.handleChainChange} htmlFor={n} value={op.id} className="form-control">
                                    {this.renderSelect(this.data.chains)}
                                </select>
                            </div>
                        </div>
                        <button type="button" className="btn btn-default" htmlFor={n+"|"+m} data-toggle="collapse" data-target={"#collapse"+n}>
                            <span className="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span>    
                        </button>
                        <button type="button" className="btn btn-danger" onClick={this.deleteOperation} htmlFor={n+"|"+m}>
                            <span htmlFor={n+"|"+m} className="glyphicon glyphicon-remove" aria-hidden="true"></span>    
                        </button>
                        <br />
                        <div className="collapse" id={"collapse"+n}>
                            <ol className="sortable">
                                {this.renderOperations(this.state.operations[n].operations,n)}
                            </ol>
                        </div>
                    </div>
                </div>
                </li>    
                );
                                  
            } else {
            
            return(
                <li className="operation" key={n+"|"+m}>
                <div className="inside">
                    <div className="form-inline">
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-addon">Операция: </div>
                                <select onChange={this.handleOpChange} htmlFor={n+"|"+m} value={op.id} className="form-control">
                                    {this.renderSelect(this.data.ops)}
                                </select>
                            </div>
                        </div>
                        <button type="button" className="btn btn-danger" onClick={this.deleteOperation} htmlFor={n+"|"+m}>
                            <span htmlFor={n+"|"+m} className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                    </div>
                    <br />
                    <div className="form-horizontal">
                        {this.renderParams(n,m)}
                    </div>
                </div>
                </li>
            );}
        });
    },
    
    deleteOperation(e) {
        var forData = e.target.getAttribute("for");
        var n = parseInt(forData.split("|")[0]);
        var m = parseInt(forData.split("|")[1]);
        if (m==-1) {
            var operations = this.state.operations;
            operations.splice(n,1);
        } else {
            var operations = this.state.operations;
            operations[m].operations.splice(n,1);
        }
        console.log(operations);
        this.setState({operations:operations});
    },
                             
    addOperation(e) {
        
        this.setState({
            operations: this.state.operations.concat([
                {id:this.data.ops[0]._id,params:{}}
            ])
        });
    },
    
    addChain(e) {
        
        this.setState({
            operations: this.state.operations.concat([
                {type:"chain",id:this.data.chains[0]._id,operations:this.data.chains[0].operations}
            ])
        });
    },
    
    checkLoading(id,result) {
        var file = Realfiles.findOne(id);
        console.log(id,result,file);
        if (file && file.url()!=null) {
            FlowRouter.go("/open/"+this.props.id+"/"+result);
        } else {
            var _this = this;
            setTimeout(function() {_this.checkLoading(id,result);},1000);
        }
    },
        
    workWithFile() {
        ReactDOM.findDOMNode(this.refs.uploadbutton).setAttribute("disabled","true");
        var _this = this;
        var operations = this.state.operations;
        var cleanops = [];
        operations.forEach(function(el, i, ar) {
            if (el.type=="chain") {cleanops = cleanops.concat(el.operations);} else {
                cleanops.push(el);
            }
        });
        console.log(cleanops);
        if (cleanops.length>1 && Chains.find({operations:cleanops}).count()==0) {
            chain = cleanops;
            $('#chainname').val("");
            $('#myModal').modal('show');
        }
        Meteor.call("changeFile",this.props.id,this.props.n,cleanops,function (error, result) {
            //console.log("error "+error);
            //console.log(result);
            if (result && result[0]>-1) _this.checkLoading(result[1],result[0]);
            //console.log(result);
            //_this.setState({filecontent:result,loaded:true});
        });
    },
    
    render() {
        if (!this.state.loaded && this.data.file) {
            this.setFileContent(this.data.file);
        }
        if (this.data.fileInfoLoading) {
            return <LoadingSpinner />;
        }
        return (
            <div>
                <button className="btn btn-primary" onClick={window.history.length>0?function(){window.history.back()}:function(){FlowRouter.go('/files')}}>Назад</button>
                <h3>Файл {this.data.file.name}, <small>вариация #{this.props.n}</small></h3>
                {this.data.currentUser?
                    <div className="btn-group form-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-default" onClick={this.addOperation}>+ Операция</button>
                        {this.data.chains.length>0?<button type="button" className="btn btn-default" onClick={this.addChain}>+ Цепочка</button>:''}
                    </div>
                :''}
                <ol className="sortable">
                    {this.renderOperations(this.state.operations,-1)}
                </ol>
                {this.state.operations.length>0?
                    <div className="form-group"><button type="button" className="btn btn-success" ref="uploadbutton" onClick={this.workWithFile}>Обработать файл</button></div>
                :''}
                <textarea className="form-control" rows="16" value={this.state.filecontent} readOnly></textarea>
            </div>
        );
    }
});