import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ChangeShelf extends React.Component {

    constructor(props) {
        super(props);

        let handleHideLoading = (props.handleHideLoading)
            ? props.handleHideLoading
            : false;

        this.state = {
            handleHideLoading: handleHideLoading,
            shelfClassName: classNames({
                'book-shelf-changer': true,
            })
        }
    }



    moveBook = (book, shelf) => {
        this.setState({
            shelfClassName: classNames({
                'book-shelf-changer': true,
                'loading': true,
                'is-visible': true
            })
        });

        this.props.onBookMove(book, shelf).then(() => {
            this.removeLoading();
        })
    }

    removeLoading() {
        if (this.state.handleHideLoading) {
            this.setState({
                shelfClassName: classNames({
                    'book-shelf-changer': true,
                })
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            mounted: false
        });
    }

    componentDidMount() {
        this.setState({
            mounted: true
        });
    }

    render() {
        return (
            <div className={this.state.shelfClassName}>
                <select
                    onMouseEnter={(e) => {
                        e.target.click()
                    }}
                    onMouseLeave={(e) => {
                        e.target.click()
                    }}
                    value={this.props.shelf} onChange={(event) => {
                        return this.moveBook(this.props.book, event.target.value);
                    }}>
                    <option value="none" disabled>Add To</option>
                    {
                        Object.keys(this.props.shelfs).map((shelfID) => {
                            return <option key={shelfID} value={shelfID}>{this.props.shelfs[shelfID].label}</option>
                        })
                    }
                    {
                        this.props.shelf !== 'none' && (
                            <option value="none">No Category</option>
                        )
                    }
                </select>
            </div>
        )
    }

}


ChangeShelf.propTypes = {
    shelf: PropTypes.string.isRequired,
    shelfs: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired,
    onBookMove: PropTypes.func.isRequired
};

export default ChangeShelf