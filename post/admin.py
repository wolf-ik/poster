from django.contrib import admin

from post.models import Category, Achievement


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'text',)
    fields = ('text',)


class AchievementAdmin(admin.ModelAdmin):
    list_display = ('id', 'title',)
    fields = ('title', 'image_url')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Achievement, AchievementAdmin)
