import Divider from '@mui/material/Divider'

const StyledDivider = (props) => {
  const style = {
    backgroundColor: '#3D454A',
    borderColor: '#3D454A',
    height: '1px',
    marginTop: '4px',
    marginBottom: '4px',
    marginLeft: '10px',
    marginRight: '10px',
  };

  return <Divider style={style} {...props} />;
};

export default StyledDivider;