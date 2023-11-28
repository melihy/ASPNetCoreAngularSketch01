using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        public readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            this._context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(q => q.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            switch (likesParams.Predicate)
            {
                case "liked":
                    {
                        likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                        users = likes.Select(like => like.TargetUser);
                    }
                    break;
                case "likedBy":
                    {
                        likes = likes.Where(likedBy => likedBy.TargetUserId == likesParams.UserId);
                        users = likes.Select(likedBy => likedBy.SourceUser);
                    }
                    break;

                default:
                    {
                        likes = likes.Where(likedBy => likedBy.TargetUserId == -1);
                        users = likes.Select(likedBy => likedBy.SourceUser);
                    }
                    break;
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
            .Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(q => q.Id == userId);
        }
    }
}