import { Roles } from 'config';

// Components
import {
    Module1,
    Module2,
    Module3,
    ModuleN,
    ModuleNChild2,
    ModuleNChild3,
    Dashboard,
    Profile,
    Module5,
    Module4,
    CreateTeacher,
} from 'components';
import Module6Child1 from 'components/Module6Child1';
import ModuleNChild4 from 'components/ModuleNChild4';
import ModuleNChild5 from 'components/ModuleNChild5';
import ModuleNChild6 from 'components/ModuleNChild6';
import StudentsPage from 'components/students';
import TeacherPage from '../components/Teacher';

import { UserOutlined, TeamOutlined, AuditOutlined, ScheduleOutlined, 
    AppstoreOutlined, DashboardOutlined, UserSwitchOutlined, IdcardOutlined } from '@ant-design/icons';

const navigationItems = [

        //for dashboard
        {
            component: Dashboard,
            path: '/dashboard',
            title: 'Dashboard',
            icon: <DashboardOutlined />,
            permission: [
                Roles.SUPER_ADMIN,
                Roles.SCHOOL_ADMIN,
                Roles.COORDINATOR,
                Roles.TEACHER
            ],
        },

//For Create school and view school
      {
        component: Module6Child1,
        path: '/schools',
        title: 'Schools',
        icon: <UserOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
        ],
    },
    {
        component: ModuleNChild3,
        path: '/classlist',
        title: 'Grades',
        icon: <IdcardOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR
        ],
    },
    {
        component: ModuleNChild5,
        path: '/sectionlist',
        title: 'Sections',
        icon: <ScheduleOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },
    {
        component: ModuleNChild6,
        path: '/listofapplications',
        title: 'Applications',
        icon: <AppstoreOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },
    {
        component: StudentsPage,
        path: '/studentpage',
        title: 'Students',
        icon: <UserOutlined/>,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },
    {
        component: Module2,
        path: '/createschool',
        title: 'Create School',
        permission: [
            Roles.SUPER_ADMIN,
        ],
    },

    //For Create admin or users and view users
   
    {
        component: ModuleNChild4,
        path: '/userslist',
        title: 'Users',
        icon: <UserSwitchOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
        ],
        // exact: true,
    },
    {
        component: Module1,
        path: '/createadmin',
        title: 'Create Users',
        permission: [
            Roles.SUPER_ADMIN,
        ],
        // exact: true,
    },

    
    //For Create role and view role
   
    {
        component: ModuleNChild2,
        path: '/userroles',
        title: 'User Roles',
        icon: <TeamOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
        ],
    },
    {
        component: Module3,
        path: '/createrole',
        title: 'Create Role',
        permission: [
            Roles.SUPER_ADMIN,
        ],
    },
    
    //For Create class and view class
   
    
    {
        component: Module4,
        path: '/createclass',
        title: 'Create Class',
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR
        ],
    },

    //For Create section and view section
    
    
    {
        component: Module5,
        path: '/createsection',
        title: 'Create Section',
        permission: [
            Roles.SUPER_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },


    //For Create application and view application
    
   
    {
        component: ModuleN,
        path: '/createapplication',
        title: 'Create Application',
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
        // children: [
        //     {
        //         component: ModuleNChild2,
        //         path: '/child-2',
        //         title: 'Child - 2',
        //     },
        //     {
        //         component: ModuleNChild3,
        //         path: '/child-3',
        //         title: 'Child - 3',
        //         permission: [
        //             Roles.SUPER_ADMIN,
        //             Roles.SCHOOL_ADMIN
        //         ]
        //     }
        // ]
    },
    
    {
        component: CreateTeacher,
        path: '/createTeacher',
        title: 'CreateTeacher',
        icon: <AuditOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },
    
    {
        component: TeacherPage,
        path: '/teacher',
        title: 'Teachers',
        icon: <AuditOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
            Roles.SCHOOL_ADMIN,
            Roles.COORDINATOR,
            Roles.TEACHER
        ],
    },
    

    {
        component: Profile,
        path: '/profile',
        title: 'Profile',
        icon: <AuditOutlined />,
        permission: [
            Roles.SUPER_ADMIN,
        ],
    },
];

export default navigationItems;