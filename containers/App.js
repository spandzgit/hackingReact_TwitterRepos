import React, {Component} from 'react';

window.API = {
    fetchPopularRepos(language) {
      // "language" can be "javascript", "ruby", "python", or "all"
      const encodedURI = encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)
      return fetch(encodedURI)
        .then((data) => data.json())
        .then((repos) => repos.items)
        .catch((error) => {
          console.warn(error)
          return null
        });
    }
  }



class Loading extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        text: 'Loading'
      };
    }
    componentDidMount() {
      const stopper = this.state.text + '...';
      this.interval = window.setInterval(() => {
        this.state.text === stopper
          ? this.setState(() => ({ text: 'Loading' }))
          : this.setState((prevState) => ({ text: prevState.text + '.' }))
      }, 300)
    }
    componentWillUnmount() {
      window.clearInterval(this.interval);
    }
    render() {
      return (
        <p>
          {this.state.text}
        </p>
      )
    }
  }

  function NavComponent(props){
    const languages = ['all', 'javascript', 'ruby', 'python'];
    return(
      <div>
        <ul>
          {languages.map((lngs, i) =>(
            <li key={i} style={{cursor : 'pointer'}} onClick={() => props.handleOnLangClick(lngs)}>
              {lngs}
            </li>
          ))

          }
        </ul>
      </div>
    )
  }

  function RepoListComponent(props){
    return(
      <div>
          <ul style={{display: 'flex', flexWrap: 'wrap'}}>
            {
              props.repos.map((repo) => (
                <li key={repo.id} style={{margin: 30}}>
                  <ul>
                    <li><a href={repo.html_url}>{repo.name}</a></li>
                    <li><span>@{repo.owner.login}</span></li>
                    <li><span>{repo.stargazers_count} Stars</span></li>
                  </ul>
                 </li>
              ))
            }
            </ul>
        </div>
    )
  }

  export default class App extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        repos : {},
        loading : true,
        lang: 'all'
      }
      this.handleOnLangClick = this.handleOnLangClick.bind(this);
      this.fetchRepos = this.fetchRepos.bind(this)
    }

    componentDidMount(){
      this.fetchRepos(this.state.lang)
    }

    componentDidUpdate(prevProps, prevState){
      if(prevState.lang !== this.state.lang){
        this.fetchRepos(this.state.lang);
      }
    }

    fetchRepos(lang){
      this.setState({
        loading: true
      })
      API.fetchPopularRepos(lang)
         .then((repos) => {
           console.log(repos) ||
           this.setState({
             repos,
             loading: false
           })
         })
    }

    handleOnLangClick(lang){
      this.setState({
        lang: lang
      })
    }

    render() {
      return (
        <div>
          <NavComponent handleOnLangClick={this.handleOnLangClick}/>
          { this.state.loading
            ? <Loading /> 
            : <div>
                <h1 style={{textAlign: 'center'}}>
                  {this.state.lang}
                </h1>
                <RepoListComponent repos={this.state.repos} />
              </div>
          }
        </div>
      )
    }
  }