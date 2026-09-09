import { Box } from '@mantine/core';

import classes from './Navbar.module.css';
import NavbarProjects from './Projects/NavbarProjects';
import ProjectsNavbarHeader from './Header/ProjectsNavbarHeader';

const Navbar = () => {
  return (
    <Box className={classes['projectsContainer']}>
      <ProjectsNavbarHeader />
      <NavbarProjects />
      <Box />
    </Box>
  );
};

export default Navbar;
