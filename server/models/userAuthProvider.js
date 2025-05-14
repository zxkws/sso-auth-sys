export default (sequelize, DataTypes) => {
  const UserAuthProvider = sequelize.define('UserAuthProvider', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['github', 'email', 'google']],
      },
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  UserAuthProvider.associate = (models) => {
    UserAuthProvider.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserAuthProvider;
};