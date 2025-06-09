#!/usr/bin/env python3
import json

# Load the image mapping data
with open('public/imageMapping.json', 'r') as f:
    data = json.load(f)

# Base prompt templates by type
base_templates = {
    'product_main': 'ultra-photorealistic 8K product photography, {item} in natural beige tones, soft natural lighting highlighting texture, modern minimalist interior background, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, khaki color palette, architectural digest quality, no text, no people --ar 16:9 --v 6',
    
    'product_detail': 'ultra-photorealistic 8K detail photography, close-up of {item} texture and craftsmanship, natural lighting highlighting material details, modern interior setting, 2-3 USM modular furniture in background, eye-level 50mm lens, shallow depth of field, tactile surface detail, architectural magazine quality, no text, no people --ar 16:9 --v 6',
    
    'product_lifestyle': 'ultra-photorealistic 8K lifestyle photography, {item} in beautiful modern living space, khaki beige minimalist interior, floor-to-ceiling windows with natural light, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, elegant living atmosphere, contemporary Korean aesthetic, no text, no people --ar 16:9 --v 6',
    
    'product_gallery': 'ultra-photorealistic 8K interior photography, {item} showcased in modern minimalist room, khaki beige color palette, large windows with natural daylight, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, sophisticated residential setting, architectural quality, no text, no people --ar 16:9 --v 6',
    
    'gallery_showcase': 'ultra-photorealistic 8K interior showcase photography, modern minimalist gallery space with khaki beige tones, floor-to-ceiling windows with natural lighting, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, sophisticated exhibition atmosphere, contemporary Korean gallery aesthetic, no text, no people --ar 16:9 --v 6',
    
    'hero_desktop': 'ultra-photorealistic 8K wide interior photography, expansive modern living space with khaki beige color scheme, floor-to-ceiling windows with Seoul city view, 2-3 USM modular furniture pieces strategically placed, natural sunlight filtering through premium curtains, eye-level 50mm lens, shallow depth of field, generous white space, architectural digest style, no text, no people --ar 21:9 --v 6',
    
    'section_bg': 'ultra-photorealistic 8K architectural interior photography, modern minimalist space with khaki beige tones, large windows with natural daylight, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, clean professional atmosphere, contemporary Korean interior design, spacious layout, no text, no people --ar 16:9 --v 6',
    
    'seasonal': 'ultra-photorealistic 8K seasonal interior photography, modern living space reflecting {season} atmosphere, khaki beige color palette with seasonal accents, floor-to-ceiling windows with natural light, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, seasonal Korean residential aesthetic, no text, no people --ar 16:9 --v 6',
    
    'project_showcase': 'ultra-photorealistic 8K architectural photography, premium {project_type} with khaki beige design elements, large windows with professional treatments, 2-3 USM modular furniture pieces, natural lighting, eye-level 50mm lens, shallow depth of field, sophisticated Korean commercial space, no text, no people --ar 16:9 --v 6',
    
    'accessories': 'ultra-photorealistic 8K detail photography, premium {accessory} in brushed metal and natural materials, khaki beige minimalist interior background, natural lighting highlighting craftsmanship, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, luxury hardware details, no text, no people --ar 16:9 --v 6',
    
    'blog_guide': 'ultra-photorealistic 8K educational photography, modern interior space demonstrating {topic}, khaki beige color palette, floor-to-ceiling windows with natural light, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, informative lifestyle setting, Korean residential aesthetic, no text, no people --ar 16:9 --v 6',
    
    'about_company': 'ultra-photorealistic 8K corporate photography, modern {space} with khaki beige professional aesthetic, large windows with natural daylight, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, professional Korean business environment, no text, no people --ar 16:9 --v 6',
    
    'future_concept': 'ultra-photorealistic 8K conceptual photography, futuristic {concept} with khaki beige and modern elements, floor-to-ceiling windows with advanced lighting, 2-3 USM modular furniture pieces, eye-level 50mm lens, shallow depth of field, innovative design atmosphere, next-generation Korean aesthetic, no text, no people --ar 16:9 --v 6'
}

# Generate prompts for items 49-148
def generate_prompt(num, description):
    desc_lower = description.lower()
    
    # Curtain products
    if 'curtain' in desc_lower:
        if 'main product shot' in desc_lower:
            item = description.split(' - ')[0].lower() + ' curtains'
            return base_templates['product_main'].format(item=item)
        elif 'detail close-up' in desc_lower:
            item = description.split(' - ')[0].lower() + ' curtain fabric'
            return base_templates['product_detail'].format(item=item)
        elif 'lifestyle scene' in desc_lower:
            item = description.split(' - ')[0].lower() + ' curtains'
            return base_templates['product_lifestyle'].format(item=item)
        elif 'gallery image' in desc_lower:
            item = description.split(' - ')[0].lower() + ' curtains'
            return base_templates['product_gallery'].format(item=item)
    
    # Blind products
    elif 'blind' in desc_lower:
        if 'main product shot' in desc_lower:
            item = description.split(' - ')[0].lower() + ' blinds'
            return base_templates['product_main'].format(item=item)
        elif 'detail close-up' in desc_lower:
            item = description.split(' - ')[0].lower() + ' blind slats'
            return base_templates['product_detail'].format(item=item)
        elif 'lifestyle scene' in desc_lower:
            item = description.split(' - ')[0].lower() + ' blinds'
            return base_templates['product_lifestyle'].format(item=item)
        elif 'gallery image' in desc_lower:
            item = description.split(' - ')[0].lower() + ' blinds'
            return base_templates['product_gallery'].format(item=item)
    
    # Motorized systems
    elif 'motorized' in desc_lower or 'smart' in desc_lower:
        if 'main product shot' in desc_lower:
            item = description.split(' - ')[0].lower() + ' system'
            return base_templates['product_main'].format(item=item)
        elif 'detail close-up' in desc_lower:
            item = description.split(' - ')[0].lower() + ' motor mechanism'
            return base_templates['product_detail'].format(item=item)
        elif 'lifestyle scene' in desc_lower:
            item = description.split(' - ')[0].lower() + ' system'
            return base_templates['product_lifestyle'].format(item=item)
        elif 'gallery image' in desc_lower:
            item = description.split(' - ')[0].lower() + ' installation'
            return base_templates['product_gallery'].format(item=item)
    
    # Gallery grid
    elif 'gallery grid' in desc_lower:
        return base_templates['gallery_showcase']
    
    # Hero images
    elif '히어로' in description:
        return base_templates['hero_desktop']
    
    # Section backgrounds
    elif '섹션 배경' in description or '배경' in description:
        return base_templates['section_bg']
    
    # Seasonal collections
    elif '계절' in description:
        seasons = {'봄': 'spring', '여름': 'summer', '가을': 'autumn', '겨울': 'winter'}
        season = None
        for k, v in seasons.items():
            if k in description:
                season = v
                break
        return base_templates['seasonal'].format(season=season or 'seasonal')
    
    # Project showcases
    elif '프로젝트' in description or 'project' in desc_lower:
        if '호텔' in description:
            project_type = 'hotel lobby'
        elif '레스토랑' in description:
            project_type = 'restaurant interior'
        elif '오피스' in description:
            project_type = 'office building'
        elif '쇼룸' in description:
            project_type = 'showroom display'
        elif '주거' in description:
            project_type = 'residential complex'
        else:
            project_type = 'commercial space'
        return base_templates['project_showcase'].format(project_type=project_type)
    
    # Accessories
    elif any(word in desc_lower for word in ['링', 'ring', '타이백', 'tieback', '발란스', 'valance', '홀드백', 'holdback', '트랙', 'track', '레일', 'rail']):
        accessory = description.replace(' 컬렉션', '').replace(' 액세서리', '')
        return base_templates['accessories'].format(accessory=accessory)
    
    # Blog/guide content
    elif any(word in description for word in ['디자인 트렌드', '관리 팁', '설치 가이드', '색상 매칭', '스타일링']):
        topic = description
        return base_templates['blog_guide'].format(topic=topic)
    
    # About company
    elif any(word in description for word in ['회사 이야기', '팀 작업 공간', '제작 과정', '품질 관리', '인증서']):
        if '작업 공간' in description:
            space = 'workspace'
        elif '제작' in description:
            space = 'manufacturing facility'
        elif '품질' in description:
            space = 'quality control laboratory'
        elif '인증' in description:
            space = 'certification display area'
        else:
            space = 'company office'
        return base_templates['about_company'].format(space=space)
    
    # Future concepts
    elif '미래' in description or 'future' in desc_lower:
        if '컨셉' in description:
            concept = 'design concepts'
        elif '연구소' in description:
            concept = 'innovation laboratory'
        elif '차세대' in description:
            concept = 'next-generation products'
        else:
            concept = 'future technology'
        return base_templates['future_concept'].format(concept=concept)
    
    # Default fallback
    else:
        return base_templates['section_bg']

# Generate prompts and append to existing file
with open('new/midjourney-prompts-ko-complete.txt', 'a', encoding='utf-8') as f:
    f.write('\n')
    
    for i in range(49, 149):
        if str(i) in data['mapping']:
            description = data['mapping'][str(i)]['description']
            prompt = generate_prompt(i, description)
            
            f.write(f'{i}. {description}\n')
            f.write(f'prompt: {prompt}\n\n')

print("✅ 모든 프롬프트 생성 완료! (49-148번)")
print("📄 파일: new/midjourney-prompts-ko-complete.txt") 