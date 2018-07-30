import React from "react";
import { connect } from "react-redux";
import { searchUsers } from "./actions";
import { Link } from "react-router-dom";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.hideResults = this.hideResults.bind(this);
    }
    hideResults() {
        let searches = document.querySelector(".search-results");
        searches.style.display = "none";
    }
    render() {
        return (
            <div className="search">
                <input
                    id="searchBar"
                    type="text"
                    name="search"
                    placeholder="Search"
                    ref={elem => {
                        this.text = elem;
                    }}
                    onChange={e =>
                        this.props.dispatch(searchUsers(e.target.value))
                    }
                />
                <div className="search-results">
                    {this.props.searchResults &&
                        this.props.searchResults.map(result => {
                            return (
                                <div className="user-result" key={result.id}>
                                    <Link
                                        onClick={() => {
                                            this.text.value = "";
                                            this.hideResults();
                                        }}
                                        to={`/user/${result.id}`}
                                    >
                                        <img
                                            className="searchPhoto"
                                            src={
                                                result.img_url ||
                                                "/assets/donut.svg"
                                            }
                                        />
                                        <span>
                                            {result.first} {result.last}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    {this.props.noResults}
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        searchResults: state.searchResults || [],
        noResults: state.noResults
    };
};

export default connect(getStateFromRedux)(Search);
