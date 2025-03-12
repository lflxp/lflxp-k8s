package utils

import (
	"sync"
	"time"

	cache "github.com/patrickmn/go-cache"
)

var (

	// 有过期时间的cache
	localCacheWithTTL *cache.Cache
	once              sync.Once
)

func NewCacheCliWithTTL() *cache.Cache {
	once.Do(func() {
		localCacheWithTTL = cache.New(10*time.Minute, 10*time.Minute)
	})
	return localCacheWithTTL
}
