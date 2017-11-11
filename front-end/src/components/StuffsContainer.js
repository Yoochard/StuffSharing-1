import { connect } from 'react-redux';
import Stuffs from './StuffsSearchResult';
import { setFilter, getStuffs } from '../actions';

const mapStateToProps = state => ({
  stuffs: state.stuffs,
  search: state.search,
});

export default connect(mapStateToProps, { setFilter, getStuffs })(Stuffs);
