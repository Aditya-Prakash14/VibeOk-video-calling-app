import axios from 'axios';

const CODEFORCES_API = 'https://codeforces.com/api';
const GITHUB_API = 'https://api.github.com';
const LEETCODE_API = 'https://leetcode-stats-api.herokuapp.com';

class PlatformService {
  async getCodeforcesUserInfo(username) {
    try {
      const response = await axios.get(`${CODEFORCES_API}/user.info`, {
        params: { handles: username },
      });
      
      if (response.data.status === 'OK') {
        const user = response.data.result[0];
        return {
          success: true,
          data: {
            username: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || 'Unrated',
            maxRank: user.maxRank || 'Unrated',
            avatar: user.avatar || user.titlePhoto,
            friendOfCount: user.friendOfCount || 0,
          },
        };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Codeforces API error:', error);
      return { success: false, error: 'Failed to fetch Codeforces data' };
    }
  }

  async getCodeforcesSubmissions(username, count = 100) {
    try {
      const response = await axios.get(`${CODEFORCES_API}/user.status`, {
        params: { handle: username, from: 1, count },
      });
      
      if (response.data.status === 'OK') {
        const submissions = response.data.result;
        const solvedProblems = new Set();
        const dailyActivity = {};

        submissions.forEach(sub => {
          if (sub.verdict === 'OK') {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedProblems.add(problemId);
            
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
            dailyActivity[date] = (dailyActivity[date] || 0) + 1;
          }
        });

        // Calculate streak
        const streak = this.calculateStreak(Object.keys(dailyActivity));

        return {
          success: true,
          data: {
            totalSolved: solvedProblems.size,
            totalSubmissions: submissions.length,
            dailyActivity,
            currentStreak: streak,
          },
        };
      }
      return { success: false, error: 'Failed to fetch submissions' };
    } catch (error) {
      console.error('Codeforces submissions error:', error);
      return { success: false, error: 'Failed to fetch submissions' };
    }
  }

  // GitHub API
  async getGitHubUserInfo(username) {
    try {
      const response = await axios.get(`${GITHUB_API}/users/${username}`);
      
      return {
        success: true,
        data: {
          username: response.data.login,
          name: response.data.name,
          avatar: response.data.avatar_url,
          bio: response.data.bio,
          publicRepos: response.data.public_repos,
          followers: response.data.followers,
          following: response.data.following,
          createdAt: response.data.created_at,
        },
      };
    } catch (error) {
      console.error('GitHub API error:', error);
      return { success: false, error: 'Failed to fetch GitHub data' };
    }
  }

  async getGitHubContributions(username) {
    try {

      const response = await axios.get(`${GITHUB_API}/users/${username}/events/public`);
      
      const dailyActivity = {};
      const today = new Date();
      const last365Days = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

      response.data.forEach(event => {
        const eventDate = new Date(event.created_at);
        if (eventDate >= last365Days) {
          const date = eventDate.toISOString().split('T')[0];
          dailyActivity[date] = (dailyActivity[date] || 0) + 1;
        }
      });

      const streak = this.calculateStreak(Object.keys(dailyActivity));

      return {
        success: true,
        data: {
          dailyActivity,
          currentStreak: streak,
          totalEvents: response.data.length,
        },
      };
    } catch (error) {
      console.error('GitHub contributions error:', error);
      return { success: false, error: 'Failed to fetch GitHub contributions' };
    }
  }

  // LeetCode API
  async getLeetCodeStats(username) {
    try {
      const response = await axios.get(`${LEETCODE_API}/${username}`);
      
      return {
        success: true,
        data: {
          username: response.data.username || username,
          totalSolved: response.data.totalSolved || 0,
          totalQuestions: response.data.totalQuestions || 0,
          easySolved: response.data.easySolved || 0,
          mediumSolved: response.data.mediumSolved || 0,
          hardSolved: response.data.hardSolved || 0,
          acceptanceRate: response.data.acceptanceRate || 0,
          ranking: response.data.ranking || 0,
        },
      };
    } catch (error) {
      console.error('LeetCode API error:', error);
      return { success: false, error: 'Failed to fetch LeetCode data' };
    }
  }

  // Utility function to calculate streak
  calculateStreak(dates) {
    if (dates.length === 0) return 0;

    const sortedDates = dates.sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check if streak is current (today or yesterday)
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const previousDate = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get all platform data for a user
  async getAllPlatformData(platforms) {
    const results = {
      codeforces: null,
      github: null,
      leetcode: null,
    };

    if (platforms.codeforces) {
      const [userInfo, submissions] = await Promise.all([
        this.getCodeforcesUserInfo(platforms.codeforces),
        this.getCodeforcesSubmissions(platforms.codeforces),
      ]);
      
      if (userInfo.success && submissions.success) {
        results.codeforces = {
          ...userInfo.data,
          ...submissions.data,
        };
      }
    }

    if (platforms.github) {
      const [userInfo, contributions] = await Promise.all([
        this.getGitHubUserInfo(platforms.github),
        this.getGitHubContributions(platforms.github),
      ]);
      
      if (userInfo.success && contributions.success) {
        results.github = {
          ...userInfo.data,
          ...contributions.data,
        };
      }
    }

    if (platforms.leetcode) {
      const stats = await this.getLeetCodeStats(platforms.leetcode);
      if (stats.success) {
        results.leetcode = stats.data;
      }
    }

    return results;
  }
}

export default new PlatformService();
