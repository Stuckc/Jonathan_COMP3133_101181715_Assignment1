const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: { type: GraphQLString },
        eid: { type: GraphQLString },
        name: { type: GraphQLString },
        designation: { type: GraphQLString },
        department: { type: GraphQLString },
        salary: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve() {
                return Employee.find();
            }
        },
        employee: {
            type: EmployeeType,
            args: { eid: { type: GraphQLString } },
            resolve(parent, args) {
                return Employee.findOne({ eid: args.eid });
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        registerUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let hashedPassword = await bcrypt.hash(args.password, 10);
                let user = new User({
                    username: args.username,
                    email: args.email,
                    password: hashedPassword
                });
                return user.save();
            }
        },
        loginUser: {
            type: GraphQLString,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let user = await User.findOne({ email: args.email });
                if (!user) throw new Error('User not found');
                let isMatch = await bcrypt.compare(args.password, user.password);
                if (!isMatch) throw new Error('Invalid credentials');

                return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            }
        },
        addEmployee: {
            type: EmployeeType,
            args: {
                eid: { type: GraphQLString },
                name: { type: GraphQLString },
                designation: { type: GraphQLString },
                department: { type: GraphQLString },
                salary: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let employee = new Employee(args);
                return employee.save();
            }
        },
        deleteEmployee: {
            type: EmployeeType,
            args: { eid: { type: GraphQLString } },
            resolve(parent, args) {
                return Employee.findOneAndDelete({ eid: args.eid });
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
