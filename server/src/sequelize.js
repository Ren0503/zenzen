const pg = require('pg');
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./models/User');
const VideoModel = require('./models/Video');
const SubscriptionModel = require('./models/Subscription');
const VideoLikeModel = require('./models/VideoLike');
const CommentModel = require('./models/Comment');
const ViewModel = require('./models/View');

pg.defaults.ssl = true;
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
(async () => await sequelize.sync({ alter: true }))();

const User = UserModel(sequelize, DataTypes);
const Video = VideoModel(sequelize, DataTypes);
const Subscription = SubscriptionModel(sequelize, DataTypes);
const VideoLike = VideoLikeModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const View = ViewModel(sequelize, DataTypes);

// Related
Video.belongsTo(User, { foreignKey: "userId" })

User.belongsToMany(Video, { through: VideoLike, foreignKey: "userId" });
Video.belongsToMany(User, { through: VideoLike, foreignKey: "videoId" });

User.hasMany(Comment, {
    foreignKey: "userId",
});
Comment.belongsTo(User, { foreignKey: "userId" });

Video.hasMany(Comment, {
    foreignKey: "videoId",
});

User.hasMany(Subscription, {
    foreignKey: "subscribeTo",
});

User.belongsToMany(Video, { through: View, foreignKey: "userId" });
Video.belongsToMany(User, { through: View, foreignKey: "videoId" });

module.exports = {
    User,
    Video,
    Subscription,
    VideoLike,
    Comment,
    View,
};