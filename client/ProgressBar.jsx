ProgressBar = React.createClass({
  render() {
    // Just render a placeholder container that will be filled in
    return (
        <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow={this.props.percantage} aria-valuemin="0" aria-valuemax="100" style={{width:this.props.percantage+"%"}}>
                <span className="sr-only">{this.props.percantage}% Complete</span>
            </div>
        </div>
    );
  }
});